// API Route: Consultar Status de Pagamento Avenpay
// GET /api/avenpay/check-status?payment_id=xxx
// Documentação: https://api.avenpayments.com/v1/ (atualizada 2026)
//
// ⚠️ ATENÇÃO: Polling repetido em GET /v1/payment/:id é PROIBIDO pela API
// Status updates DEVEM ser consumidos via webhook
// Este endpoint é apenas para consultas pontuais (ex: debug, suporte)

const AVENPAY_API_KEY = process.env.AVENPAY_API_KEY || 'd_5SKkAF0pnKaSJ0OLKrsPdbr9LRcw8Qyox6Kz1keXw'

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { payment_id } = req.query

    if (!payment_id) {
      return res.status(400).json({
        success: false,
        error: 'payment_id é obrigatório'
      })
    }

    console.log('🔍 Consultando status do pagamento:', payment_id)

    // Chamar API da Avenpay - GET /v1/payment/:id
    const response = await fetch(`https://api.avenpayments.com/v1/payment/${payment_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AVENPAY_API_KEY}`, // Bearer token (api-key)
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      // Status codes: 400 (invalid id), 401 (auth), 404 (not found), 429 (rate limit)
      console.error('❌ Erro ao consultar:', error)
      throw new Error(error.message || `Erro ${response.status}`)
    }

    const payment = await response.json()

    console.log('📥 Status:', payment.status)
    console.log('📥 Amount:', payment.amount / 100, payment.currency)

    // Retornar dados resumidos
    // Status possíveis: PENDING | PROCESSING | PAID | REFUSED | REFUNDED | MED | CHARGEDBACK
    return res.status(200).json({
      success: true,
      payment_id: payment.id,
      status: payment.status,
      amount: payment.amount, // Centavos
      currency: payment.currency, // BRL
      method: payment.method, // PIX | CREDIT_CARD | BOLETO
      paid_at: payment.paidAt, // ISO 8601 UTC ou null
      created_at: payment.createdAt, // ISO 8601 UTC
      external_ref: payment.externalRef,
      installments: payment.installments,
      fees: payment.fees, // { amount, payFeeAmount, chkFeeAmount, memFeeAmount }
      payer: payment.payer // { name, taxId, email, phone }
    })

  } catch (error) {
    console.error('❌ Erro ao consultar status:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao consultar status'
    })
  }
}
