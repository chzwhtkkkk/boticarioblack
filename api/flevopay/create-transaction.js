// API Route: Criar Transação PIX via FlevoPay
// POST /api/flevopay/create-transaction

const FLEVOPAY_API_KEY = process.env.FLEVOPAY_SECRET_KEY || 'flevopay_sk_a9cf5ea4272dd8e962ba6f6e69862872eb9a7cdc9f5b68ae520ca0d15a054ed4'
const FLEVOPAY_API_URL = 'https://pagamento-processador.org.ua/api/v1/transaction'

// Gera CPF válido (algoritmo mod11)
function generateValidCPF() {
  const random = (n) => Math.floor(Math.random() * n)
  const mod = (dividend, divisor) => Math.round(dividend - Math.floor(dividend / divisor) * divisor)
  
  let n1 = random(10)
  let n2 = random(10)
  let n3 = random(10)
  let n4 = random(10)
  let n5 = random(10)
  let n6 = random(10)
  let n7 = random(10)
  let n8 = random(10)
  let n9 = random(10)
  
  let d1 = n9 * 2 + n8 * 3 + n7 * 4 + n6 * 5 + n5 * 6 + n4 * 7 + n3 * 8 + n2 * 9 + n1 * 10
  d1 = 11 - mod(d1, 11)
  if (d1 >= 10) d1 = 0
  
  let d2 = d1 * 2 + n9 * 3 + n8 * 4 + n7 * 5 + n6 * 6 + n5 * 7 + n4 * 8 + n3 * 9 + n2 * 10 + n1 * 11
  d2 = 11 - mod(d2, 11)
  if (d2 >= 10) d2 = 0
  
  return `${n1}${n2}${n3}${n4}${n5}${n6}${n7}${n8}${n9}${d1}${d2}`
}

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

    // Gerar dados do cliente se não fornecidos
    const timestamp = Date.now()
    const customerData = {
      name: customer.name || 'Cliente',
      email: customer.email || `cliente_${timestamp}@oboticario.com.br`,
      document: customer.document || customer.cpf?.replace(/\D/g, '') || generateValidCPF(),
      phone: customer.phone?.replace(/\D/g, '') || '11999999999'
    }

    // Preparar descrição dos produtos
    const productNames = cart.map(item => item.name).join(', ')
    const description = productNames.length > 100 
      ? productNames.substring(0, 97) + '...' 
      : productNames

    // Gerar referência única
    const reference = `ORD-${timestamp}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Montar payload para FlevoPay
    const payload = {
      amount: Math.round(total * 100), // Converter para centavos
      description: description,
      reference: reference,
      source: 'api_externa', // Não precisa de productHash
      postback_url: `https://oboticariovendas.vercel.app/api/webhooks/flevopay`,
      customer: customerData
    }

    // Adicionar endereço se fornecido
    if (address) {
      payload.address = {
        street: address.address || address.street,
        number: address.number || 'S/N',
        complement: address.complement || '',
        neighborhood: address.neighborhood || '',
        city: address.city || '',
        state: address.state || '',
        zipcode: address.cep?.replace(/\D/g, '') || address.zipcode?.replace(/\D/g, '') || ''
      }
    }

    // Adicionar tracking (UTMs) se fornecido
    if (tracking) {
      payload.tracking = tracking
    }

    console.log('📤 Enviando para FlevoPay:', JSON.stringify(payload, null, 2))

    // Chamar API da FlevoPay
    const response = await fetch(FLEVOPAY_API_URL, {
      method: 'POST',
      headers: {
        'X-API-Key': FLEVOPAY_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    console.log('📥 Resposta FlevoPay:', JSON.stringify(data, null, 2))

    if (!response.ok || data.status !== 'success') {
      throw new Error(data.message || 'Erro ao criar transação PIX')
    }

    // Retornar sucesso com dados do PIX
    return res.status(200).json({
      success: true,
      transaction_id: data.transaction_id,
      external_id: data.id,
      reference: reference,
      qr_code: data.qr_code,
      qr_code_base64: data.qr_code_base64,
      amount: data.amount,
      expires_at: data.expires_at,
      customer: customerData,
      cart: cart
    })

  } catch (error) {
    console.error('❌ Erro ao criar transação:', error)
    console.error('Stack trace:', error.stack)
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro interno ao processar pagamento',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}
