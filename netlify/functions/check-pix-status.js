const ZUCKPAY_API_URL = 'https://zuckpay.com.br/conta/v3'
const CLIENT_ID = 'chzwhtkkk_1805993919'
const CLIENT_SECRET = 'b90f15e9d6194e04cf6cf771cb39b7f6e1e6544e36b67225a65e5e31d2da74b2'

// Função para criar autenticação Basic
const getAuthHeader = () => {
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
  return `Basic ${credentials}`
}

export default async function handler(req, res) {
  // Permite CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { pixId, orderId } = req.query

    if (!pixId && !orderId) {
      return res.status(400).json({ error: 'pixId or orderId is required' })
    }

    console.log('[API check-pix-status] Verificando status do PIX:', { pixId, orderId })

    // Consulta a transação na ZuckPay usando o endpoint de listagem
    const response = await fetch(`${ZUCKPAY_API_URL}/transactions`, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('[API check-pix-status] Erro HTTP da ZuckPay:', response.status)
      // Se não conseguir consultar, retorna pending
      return res.status(200).json({
        success: true,
        status: 'pending',
        paid: false,
        message: 'Não foi possível consultar o status. Aguarde a confirmação.'
      })
    }

    const data = await response.json()
    console.log('[API check-pix-status] Resposta da ZuckPay:', data)

    // Procura a transação pelo ID ou external_id
    let transaction = null
    if (data.transactions && Array.isArray(data.transactions)) {
      transaction = data.transactions.find(t => 
        t.id === pixId || 
        t.transactionId === pixId ||
        t.external_id === orderId ||
        t.external_id_client === orderId
      )
    }

    if (transaction) {
      const isPaid = transaction.status === 'paid' || 
                     transaction.status === 'approved' || 
                     transaction.status === 'PAID' ||
                     transaction.status === 'APPROVED'
      
      console.log('[API check-pix-status] Transação encontrada:', {
        id: transaction.id,
        status: transaction.status,
        isPaid
      })

      return res.status(200).json({
        success: true,
        status: transaction.status,
        paid: isPaid,
        data: transaction
      })
    }

    // Se não encontrou, retorna pending
    console.log('[API check-pix-status] Transação não encontrada, retornando pending')
    return res.status(200).json({
      success: true,
      status: 'pending',
      paid: false,
      message: 'Transação não encontrada. Aguarde alguns segundos e tente novamente.'
    })
  } catch (error) {
    console.error('[API check-pix-status] Erro:', error)
    return res.status(200).json({
      success: true,
      status: 'pending',
      paid: false,
      error: error.message
    })
  }
}
