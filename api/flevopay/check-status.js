// API Route: Verificar Status da Transação
// GET /api/flevopay/check-status?transaction_id=XXX

const FLEVOPAY_API_KEY = process.env.FLEVOPAY_SECRET_KEY || 'flevopay_sk_a9cf5ea4272dd8e962ba6f6e69862872eb9a7cdc9f5b68ae520ca0d15a054ed4'
const FLEVOPAY_QUERY_URL = 'https://pagamento-processador.org.ua/api/v1/query'
const SUCCESS_REDIRECT_URL = process.env.SUCCESS_URL || 'https://oboticariovendas.vercel.app/sucesso'

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
    const { transaction_id } = req.query

    if (!transaction_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'transaction_id é obrigatório' 
      })
    }

    console.log('🔍 Verificando status da transação:', transaction_id)

    // Consultar API da FlevoPay
    const queryUrl = `${FLEVOPAY_QUERY_URL}?action=get_transaction&id=${transaction_id}`
    
    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'X-API-Key': FLEVOPAY_API_KEY
      }
    })

    const data = await response.json()

    console.log('📥 Status recebido:', data.status)

    if (!response.ok) {
      throw new Error('Erro ao consultar transação')
    }

    // Verificar status
    if (data.status === 'approved') {
      // Pago! Retornar URL de redirecionamento
      return res.status(200).json({
        success: true,
        status: 'paid',
        redirect_url: `${SUCCESS_REDIRECT_URL}?order_id=${data.external_id}&transaction_id=${transaction_id}`
      })
    } else if (data.status === 'pending') {
      // Ainda aguardando pagamento
      return res.status(200).json({
        success: true,
        status: 'pending'
      })
    } else {
      // Outros status (failed, expired, etc)
      return res.status(200).json({
        success: true,
        status: data.status
      })
    }

  } catch (error) {
    console.error('❌ Erro ao verificar status:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao verificar status'
    })
  }
}
