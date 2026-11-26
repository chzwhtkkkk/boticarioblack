// API Route: Criar Pagamento PIX via Avenpay
// POST /api/avenpay/create-payment
// Documentação: https://api.avenpayments.com/v1/ (atualizada 2026)

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

    console.log('📥 [CREATE-PAYMENT] Request recebido')
    console.log('📥 [CREATE-PAYMENT] Body:', JSON.stringify(req.body, null, 2))

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

    // Preparar dados do cliente (payer)
    const timestamp = Date.now()
    const customerData = {
      name: customer.name || 'Cliente',
      email: customer.email || `cliente_${timestamp}@oboticario.com.br`,
      taxId: cpf.replace(/\D/g, ''), // Obrigatório para BRL (CPF ou CNPJ)
      phone: customer.phone?.replace(/\D/g, '') 
        ? `+55${customer.phone.replace(/\D/g, '')}` 
        : '+5511999999999' // Formato internacional obrigatório
    }

    // Preparar itens (products)
    const items = cart.map(item => ({
      quantity: item.quantity || 1,
      name: item.name.substring(0, 256), // Max 256 chars
      price: Math.round(item.price * 100), // Centavos (smallest unit)
      type: 'PHYSICAL' // PHYSICAL = tem entrega | DIGITAL = sem entrega
    }))

    // Calcular amount total em centavos
    const amount = Math.round(total * 100)

    // Gerar referência única
    const reference = `ORD-${timestamp}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Preparar descrição - IMPORTANTE: nome do produto, não "Pedido 1234"
    // Exemplo: "Malbec Desodorante Colônia, Nativa Spa Creme Hidratante"
    const productNames = cart.map(item => item.name).join(', ')
    const description = productNames.length > 255 
      ? productNames.substring(0, 252) + '...' 
      : productNames.length < 5
      ? cart[0]?.name || 'Produto O Boticário' // Sempre nome do produto
      : productNames

    // ⚠️ NOVIDADE AVENPAY: sourceUrl obrigatório para PIX (segurança)
    // Link da página do produto no site (não pode ser homepage nem genérico)
    // Pegamos o primeiro produto do carrinho como referência
    const firstProduct = cart[0]
    const productSlug = firstProduct.name
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]+/g, '-') // Substitui caracteres especiais por -
      .replace(/^-+|-+$/g, '') // Remove - do início e fim
    
    const sourceUrl = `https://vendasoboticario.vercel.app/produto/${productSlug}` // URL específica do produto

    // Montar payload para Avenpay (v1 API)
    const payload = {
      amount: amount, // Integer em centavos (smallest unit)
      currency: 'BRL', // ISO 4217
      method: 'PIX', // PIX | CREDIT_CARD | BOLETO
      description: description, // Nome do produto (não "Pedido 1234")
      sourceUrl: sourceUrl, // ⚠️ OBRIGATÓRIO para PIX - URL específica do produto
      externalRef: reference, // Sua referência interna
      notificationUrl: `https://vendasoboticario.vercel.app/api/webhooks/avenpay`, // Webhook endpoint
      ip: req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || '127.0.0.1', // IP do comprador (não do servidor)
      payer: customerData, // name, taxId (CPF/CNPJ obrigatório em BRL), email, phone
      items: items, // quantity, name, price (centavos), type (PHYSICAL | DIGITAL)
      metadata: {
        provider: 'oboticario-vendas', // Max 50 chars
        orderId: reference,
        sellerTaxId: '00000000000191',
        sellerEmail: 'contato@oboticario.com.br',
        checkoutUrl: 'https://vendasoboticario.vercel.app/checkout',
        returnUrl: 'https://vendasoboticario.vercel.app/sucesso', // Para 3DS (mesmo origin do checkout)
        shopUrl: 'https://vendasoboticario.vercel.app',
        referrerLink: null,
        extra: JSON.stringify({ cart, address }) // Dados customizados
      }
    }

    // Adicionar endereço de entrega (obrigatório quando tem item PHYSICAL)
    // Formato da API v1: zipCode, country, state, city, district (neighborhood), street, number, complement
    if (address) {
      payload.delivery = {
        fee: 0, // Taxa de entrega em centavos (não somado ao amount)
        address: {
          country: 'BR',
          state: address.state || 'SP',
          city: address.city || 'São Paulo',
          district: address.neighborhood || 'Centro', // "district" na API = neighborhood
          street: address.street || address.address || 'Rua Exemplo',
          number: address.number || 'S/N',
          zipCode: (address.cep || address.zipCode || '01001000').replace(/\D/g, ''), // Sem traço
          complement: address.complement || ''
        }
      }
    } else {
      // Endereço padrão quando não fornecido
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

    // Adicionar UTMs (tracking de origem)
    if (tracking) {
      payload.utms = {
        utmSource: tracking.utm_source || tracking.utmSource || null,
        utmMedium: tracking.utm_medium || tracking.utmMedium || null,
        utmCampaign: tracking.utm_campaign || tracking.utmCampaign || null,
        utmContent: tracking.utm_content || tracking.utmContent || null,
        utmTerm: tracking.utm_term || tracking.utmTerm || null,
        src: tracking.src || null, // Source custom
        sck: tracking.sck || null  // Source custom key
      }
    }

    console.log('📤 [CREATE-PAYMENT] Payload preparado')
    console.log('📤 [CREATE-PAYMENT] Enviando para Avenpay API v1...')

    // Chamar API da Avenpay com Bearer token (api-key, não saque-key)
    const response = await fetch(AVENPAY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AVENPAY_API_KEY}`, // Bearer token authentication
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    console.log('📥 [CREATE-PAYMENT] Status HTTP:', response.status)
    console.log('📥 [CREATE-PAYMENT] Resposta Avenpay:', JSON.stringify(data, null, 2))

    if (!response.ok) {
      console.error('❌ [CREATE-PAYMENT] Erro da Avenpay:', data)
      
      // Tratar erros específicos da API
      const errorCode = data.code || 'unknown'
      const errorMessage = data.message || `Erro ${response.status} ao criar pagamento`
      
      // Status codes: 400 (validation), 401 (auth), 403 (not allowed), 422 (business rule), 429 (rate limit), 502 (provider)
      console.error('❌ [CREATE-PAYMENT] Error code:', errorCode)
      
      throw new Error(errorMessage)
    }

    // Extrair dados do PIX da resposta
    // Resposta v1 API: { id, amount, method, currency, status, data: { copypaste, e2e }, splits, fees, ... }
    const pixData = data.data || {}

    // Retornar sucesso com dados do PIX
    return res.status(200).json({
      success: true,
      payment_id: data.id, // ID do pagamento na Avenpay
      external_ref: reference, // Referência interna
      qr_code: pixData.copypaste, // Código PIX copia e cola
      qr_code_base64: null, // Avenpay não retorna base64, apenas copypaste
      amount: data.amount, // Amount em centavos
      currency: data.currency, // BRL
      status: data.status, // PENDING | PROCESSING | PAID | REFUSED | REFUNDED | MED | CHARGEDBACK
      created_at: data.createdAt, // ISO 8601 UTC
      paid_at: data.paidAt, // null até ser pago
      // Novos campos da API v1
      installments: data.installments, // 1 para PIX
      fees: data.fees, // { amount, payFeeAmount, chkFeeAmount, memFeeAmount }
      splits: data.splits, // Array de splits (divisão de valores)
      e2e: pixData.e2e, // End-to-end ID (preenchido após pagamento)
      // Dados originais
      customer: customerData,
      cart: cart
    })

  } catch (error) {
    console.error('❌ [CREATE-PAYMENT] Erro capturado:', error.message)
    console.error('❌ [CREATE-PAYMENT] Stack:', error.stack)
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao processar pagamento. Tente novamente.',
      details: process.env.NODE_ENV === 'development' ? error.stack : 'Entre em contato com o suporte'
    })
  }
}
