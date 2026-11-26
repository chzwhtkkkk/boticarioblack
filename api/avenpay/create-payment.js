// API Route: Criar Pagamento PIX via Avenpay
// POST /api/avenpay/create-payment

const AVENPAY_API_KEY = process.env.AVENPAY_API_KEY || 'd_5SKkAF0pnKaSJ0OLKrsPdbr9LRcw8Qyox6Kz1keXw'
const AVENPAY_API_URL = 'https://api.avenpayments.com/v1/payment'

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { customer, cart, total, address, tracking } = req.body

    console.log('📥 Request body:', JSON.stringify(req.body, null, 2))

    // Validações
    if (!customer || !cart || !total) {
      console.error('❌ Campos obrigatórios faltando')
      return res.status(400).json({ 
        success: false, 
        error: 'Campos obrigatórios: customer, cart, total' 
      })
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      console.error('❌ Carrinho inválido ou vazio')
      return res.status(400).json({
        success: false,
        error: 'Carrinho inválido ou vazio'
      })
    }

    // Validar CPF (obrigatório pra BRL)
    const cpf = customer.document || customer.cpf
    if (!cpf) {
      console.error('❌ CPF obrigatório')
      return res.status(400).json({
        success: false,
        error: 'CPF é obrigatório para pagamentos em BRL'
      })
    }

    // Preparar dados do cliente
    const timestamp = Date.now()
    const customerData = {
      name: customer.name || 'Cliente',
      email: customer.email || `cliente_${timestamp}@oboticario.com.br`,
      taxId: cpf.replace(/\D/g, ''),
      phone: customer.phone?.replace(/\D/g, '') || '11999999999'
    }

    // Preparar itens
    const items = cart.map(item => ({
      quantity: item.quantity || 1,
      name: item.name,
      price: Math.round(item.price * 100), // Converter pra centavos
      type: 'PHYSICAL' // Todos os produtos têm entrega
    }))

    // Calcular amount total em centavos
    const amount = Math.round(total * 100)

    // Gerar referência única
    const reference = `ORD-${timestamp}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Preparar descrição
    const productNames = cart.map(item => item.name).join(', ')
    const description = productNames.length > 250 
      ? productNames.substring(0, 247) + '...' 
      : productNames

    // Montar payload para Avenpay
    const payload = {
      amount: amount,
      currency: 'BRL',
      method: 'PIX',
      description: description,
      externalRef: reference,
      notificationUrl: `https://vendasoboticario.vercel.app/api/webhooks/avenpay`,
      ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || '127.0.0.1',
      payer: customerData,
      items: items,
      metadata: {
        provider: 'oboticario-vendas',
        orderId: reference,
        sellerTaxId: '00000000000191', // CNPJ genérico
        sellerEmail: 'contato@oboticario.com.br',
        checkoutUrl: 'https://vendasoboticario.vercel.app/checkout',
        returnUrl: 'https://vendasoboticario.vercel.app/sucesso',
        shopUrl: 'https://vendasoboticario.vercel.app',
        referrerLink: null,
        extra: JSON.stringify({ cart, address })
      }
    }

    // Adicionar endereço se fornecido (obrigatório quando tem item PHYSICAL)
    if (address) {
      payload.delivery = {
        fee: 0, // Frete grátis
        address: {
          country: 'BR',
          state: address.state || 'SP',
          city: address.city || 'São Paulo',
          district: address.neighborhood || 'Centro',
          street: address.street || address.address || 'Rua Exemplo',
          number: address.number || 'S/N',
          zipCode: address.cep?.replace(/\D/g, '') || address.zipCode?.replace(/\D/g, '') || '01001000',
          complement: address.complement || ''
        }
      }
    } else {
      // Endereço padrão se não fornecido
      payload.delivery = {
        fee: 0,
        address: {
          country: 'BR',
          state: 'SP',
          city: 'São Paulo',
          district: 'Centro',
          street: 'A definir',
          number: 'S/N',
          zipCode: '01001000'
        }
      }
    }

    // Adicionar UTMs se fornecido
    if (tracking) {
      payload.utms = {
        utmSource: tracking.utm_source || tracking.utmSource || null,
        utmMedium: tracking.utm_medium || tracking.utmMedium || null,
        utmCampaign: tracking.utm_campaign || tracking.utmCampaign || null,
        utmContent: tracking.utm_content || tracking.utmContent || null,
        utmTerm: tracking.utm_term || tracking.utmTerm || null,
        src: tracking.src || null,
        sck: tracking.sck || null
      }
    }

    console.log('📤 Enviando para Avenpay:', JSON.stringify(payload, null, 2))

    // Chamar API da Avenpay
    const response = await fetch(AVENPAY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AVENPAY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    console.log('📥 Resposta Avenpay:', JSON.stringify(data, null, 2))
    console.log('📥 Status HTTP:', response.status)

    if (!response.ok) {
      throw new Error(data.message || `Erro ${response.status} ao criar pagamento`)
    }

    // Extrair dados do PIX
    const pixData = data.data || {}

    // Retornar sucesso com dados do PIX
    return res.status(200).json({
      success: true,
      payment_id: data.id,
      external_ref: reference,
      qr_code: pixData.copypaste,
      qr_code_base64: null, // Avenpay não retorna base64, só copypaste
      amount: data.amount,
      status: data.status,
      created_at: data.createdAt,
      customer: customerData,
      cart: cart
    })

  } catch (error) {
    console.error('❌ Erro ao criar pagamento:', error)
    console.error('Stack trace:', error.stack)
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro interno ao processar pagamento',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}
