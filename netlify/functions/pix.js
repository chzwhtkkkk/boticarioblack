const https = require('https')

exports.handler = async function(event, context) {
  // CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  const CLIENT_ID = 'chzwhtkkk_1805993919'
  const CLIENT_SECRET = 'b90f15e9d6194e04cf6cf771cb39b7f6e1e6544e36b67225a65e5e31d2da74b2'

  try {
    const { orderId, total, customer, utms, fbc, fbp } = JSON.parse(event.body)

    console.log('[Netlify PIX] Criando PIX:', { orderId, total, customerName: customer.name })

    // Payload conforme documentação ZuckPay
    const payload = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      nome: customer.name,
      cpf: customer.document,
      valor: parseFloat(total.toFixed(2)),
      email: customer.email,
      telefone: customer.phone,
      descricao: `Pedido ${orderId}`,
      external_id_client: orderId,
      urlnoty: 'https://oboticario-revendas.netlify.app/.netlify/functions/webhook'
    }

    // Adiciona parâmetros de rastreamento
    if (utms?.utm_source) payload.utm_source = utms.utm_source
    if (utms?.utm_medium) payload.utm_medium = utms.utm_medium
    if (utms?.utm_campaign) payload.utm_campaign = utms.utm_campaign
    if (utms?.utm_content) payload.utm_content = utms.utm_content
    if (utms?.utm_term) payload.utm_term = utms.utm_term
    if (fbc) payload.fbc = fbc
    if (fbp) payload.fbp = fbp

    console.log('[Netlify PIX] Enviando para ZuckPay...')

    const bodyData = JSON.stringify(payload)

    const result = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'www.zuckpay.com.br',
        port: 443,
        path: '/conta/v3/pix/qrcode',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(bodyData),
          'Accept': 'application/json'
        }
      }

      const request = https.request(options, (response) => {
        let data = ''
        response.on('data', (chunk) => { data += chunk })
        response.on('end', () => {
          console.log('[Netlify PIX] Status:', response.statusCode)
          console.log('[Netlify PIX] Resposta:', data.substring(0, 500))
          
          try {
            resolve({
              statusCode: response.statusCode,
              data: JSON.parse(data)
            })
          } catch (e) {
            console.error('[Netlify PIX] Erro ao fazer parse:', e)
            reject(new Error(`Resposta inválida: ${data.substring(0, 200)}`))
          }
        })
      })

      request.on('error', (error) => {
        console.error('[Netlify PIX] Erro na requisição:', error)
        reject(error)
      })

      request.write(bodyData)
      request.end()
    })

    if (result.statusCode !== 200 && result.statusCode !== 201) {
      console.error('[Netlify PIX] Erro:', result.statusCode, result.data)
      
      let errorMessage = 'Erro ao gerar PIX. '
      
      if (result.statusCode === 401) {
        errorMessage += 'Erro de autenticação. Verifique as credenciais.'
      } else if (result.statusCode === 500) {
        errorMessage += 'Estamos com instabilidade temporária. Tente novamente em alguns minutos.'
      } else if (result.data.message) {
        errorMessage += result.data.message
      } else {
        errorMessage += 'Por favor, verifique seus dados e tente novamente.'
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: false,
          error: errorMessage,
          debug: {
            status: result.statusCode,
            response: result.data
          }
        })
      }
    }

    const data = result.data

    console.log('[Netlify PIX] PIX criado com sucesso:', data.transactionId)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          transactionId: data.transactionId,
          external_id: data.external_id || data.external_id_client || orderId,
          status: data.status,
          amount: data.amount,
          expiration: data.calendar?.expiration,
          qrcode: data.qrcode,
          pix_code: data.pix_code,
          pixCopyPaste: data.pix_code,
          qrcode_image: data.qrcode_image,
          checkout_url: data.checkout_url
        }
      })
    }
  } catch (error) {
    console.error('[Netlify PIX] Exception:', error)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Erro ao processar pagamento'
      })
    }
  }
}
