const ZUCKPAY_API_URL = 'https://zuckpay.com.br/conta/v3'
const CLIENT_ID = 'chzwhtkkk_1200998812'
const CLIENT_SECRET = 'a60f8563e7964729f7366cb8b152be9d789d8a85897cd418cb1a60a3642a3f34'

// Função para criar autenticação Basic
const getAuthHeader = () => {
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
  return `Basic ${credentials}`
}

export default async function handler(req, res) {
  // Permite CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { orderData, cardData } = req.body

    // 🧪 MODO TESTE - Cartão de teste simula aprovação
    const isTestCard = cardData.cardNumber.replace(/\s/g, '') === '4111111111111111'
    
    if (isTestCard) {
      console.log('🧪 MODO TESTE - Simulando aprovação de cartão')
      
      // Simula resposta de sucesso
      return res.status(200).json({
        success: true,
        requires3DS: false,
        data: {
          transactionId: `TEST-${Date.now()}`,
          status: 'PAID',
          isPaid: true,
          amount: parseFloat(orderData.total),
          installments: parseInt(cardData.installments) || 1,
          currency: 'BRL'
        }
      })
    }

    // Monta descrição com endereço completo
    const addressDescription = `Pedido #${orderData.orderId} - Endereço: ${orderData.customer.address}, ${orderData.customer.number}${orderData.customer.complement ? ', ' + orderData.customer.complement : ''} - ${orderData.customer.neighborhood}, ${orderData.customer.city}/${orderData.customer.state} - CEP: ${orderData.customer.cep}`

    const payload = {
      nome: orderData.customer.name || 'Cliente',
      email: orderData.customer.email || 'cliente@email.com',
      valor: parseFloat(orderData.total),
      card_raw: {
        number: cardData.cardNumber.replace(/\s/g, ''),
        holder_name: cardData.cardName,
        exp_month: cardData.expiryMonth,
        exp_year: cardData.expiryYear,
        cvv: cardData.cvv
      },
      installments: parseInt(cardData.installments) || 1,
      currency: 'BRL',
      urlnoty: `${req.headers.origin || 'https://seu-dominio.vercel.app'}/api/webhook-zuckpay`,
      return_url: `${req.headers.origin || 'https://seu-dominio.vercel.app'}/pedido-confirmado`,
      descricao: addressDescription,
      external_id_client: orderData.orderId,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    }

    console.log('Criando pagamento com cartão ZuckPay:', {
      ...payload,
      card_raw: { ...payload.card_raw, number: '****', cvv: '***' }
    })

    const response = await fetch(`${ZUCKPAY_API_URL}/card/charge`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()
    console.log('Resposta ZuckPay Cartão:', data)

    if (!response.ok) {
      throw new Error(data.message || `Erro HTTP: ${response.status}`)
    }

    // Verifica se precisa de 3DS
    if (data.status === 'PENDING_3DS' && data.threeDSecureUrl) {
      return res.status(200).json({
        success: true,
        requires3DS: true,
        data: {
          transactionId: data.transactionId,
          status: data.status,
          threeDSecureUrl: data.threeDSecureUrl,
          amount: data.amount,
          installments: data.installments
        }
      })
    }

    // Verifica se foi recusado
    if (data.status === 'FAILED' || data.status === 'REFUSED') {
      return res.status(200).json({
        success: false,
        error: data.failureMessage || 'Pagamento recusado. Verifique os dados do cartão.'
      })
    }

    // Sucesso!
    return res.status(200).json({
      success: true,
      requires3DS: false,
      data: {
        transactionId: data.transactionId,
        status: data.status,
        isPaid: data.isPaid || data.status === 'PAID',
        amount: data.amount,
        installments: data.installments,
        currency: data.currency
      }
    })
  } catch (error) {
    console.error('Erro ao criar pagamento com cartão:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
