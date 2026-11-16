import https from 'https'

export default async function handler(req, res) {
  // CORS completo
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(200).json({ 
      error: 'Use POST method',
      receivedMethod: req.method
    })
    return
  }

  const CLIENT_ID = 'chzwhtkkk_1805993919'
  const CLIENT_SECRET = 'b90f15e9d6194e04cf6cf771cb39b7f6e1e6544e36b67225a65e5e31d2da74b2'

  try {
    const { orderId, total, customer, utms, fbc, fbp } = req.body

    // Log do payload recebido
    console.log('Payload recebido no checkout:', JSON.stringify({ orderId, total, customer: { ...customer, document: '***' } }, null, 2))

    const payload = {
      nome: customer.name,
      cpf: customer.document,
      valor: parseFloat(total.toFixed(2)),
      email: customer.email,
      telefone: customer.phone,
      descricao: `Pedido ${orderId}`,
      external_id_client: orderId,
      urlnoty: 'https://oboticario--revendas.vercel.app/api/webhook'
    }

    if (utms?.utm_source) payload.utm_source = utms.utm_source
    if (utms?.utm_medium) payload.utm_medium = utms.utm_medium
    if (utms?.utm_campaign) payload.utm_campaign = utms.utm_campaign
    if (fbc) payload.fbc = fbc
    if (fbp) payload.fbp = fbp

    console.log('Payload enviado para ZuckPay:', JSON.stringify({ ...payload, cpf: '***' }, null, 2))

    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
    const bodyData = JSON.stringify(payload)

    // Usar https nativo do Node.js ao invés de fetch para garantir POST
    const result = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'www.zuckpay.com.br',
        port: 443,
        path: '/conta/v3/pix/qrcode',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(bodyData),
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json'
        }
      }

      const request = https.request(options, (response) => {
        let data = ''

        response.on('data', (chunk) => {
          data += chunk
        })

        response.on('end', () => {
          try {
            console.log('Resposta bruta da ZuckPay:', data)
            const jsonData = JSON.parse(data)
            resolve({
              statusCode: response.statusCode,
              data: jsonData
            })
          } catch (e) {
            console.error('Erro ao fazer parse da resposta:', e)
            console.error('Resposta recebida:', data)
            reject(new Error(`Resposta inválida da ZuckPay: ${data.substring(0, 200)}`))
          }
        })
      })

      request.on('error', (error) => {
        reject(error)
      })

      request.write(bodyData)
      request.end()
    })

    if (result.statusCode !== 200 && result.statusCode !== 201) {
      console.error('Erro da ZuckPay:', result.statusCode, result.data)
      
      // Mensagem mais amigável para o usuário
      let userMessage = 'Erro ao gerar PIX. '
      
      if (result.statusCode === 500) {
        userMessage += 'Estamos com uma instabilidade temporária. Por favor, tente novamente em alguns minutos ou entre em contato pelo WhatsApp: (11) 95194-7983'
      } else if (result.data.message) {
        userMessage += result.data.message
      } else {
        userMessage += 'Por favor, verifique seus dados e tente novamente.'
      }
      
      res.status(200).json({
        success: false,
        error: userMessage,
        technicalDetails: result.data,
        debug: {
          status: result.statusCode
        }
      })
      return
    }

    const data = result.data

    res.status(200).json({
      success: true,
      data: {
        transactionId: data.transactionId,
        external_id: data.external_id,
        status: data.status,
        amount: data.amount,
        expiration: data.calendar?.expiration,
        qrcode: data.qrcode,
        pix_code: data.pix_code,
        qrcode_image: data.qrcode_image,
        checkout_url: data.checkout_url
      }
    })
  } catch (error) {
    console.error('Erro ao processar PIX:', error)
    res.status(200).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}
