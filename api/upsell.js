const ZUCKPAY_API_URL = 'https://zuckpay.com.br/conta/api'
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

  // GET: Obter configuração
  if (req.method === 'GET' && req.query.action === 'config') {
    try {
      return res.status(200).json({
        success: true,
        stripe_public_key: 'pk_live_...',
        stripe_enabled: false,
        zuckpay_enabled: true
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  // POST: Processar upsell
  if (req.method === 'POST') {
    try {
      const { tid, product_id, product_name, product_price } = req.body

      if (!tid) {
        return res.status(400).json({
          success: false,
          error: 'Transaction ID (tid) é obrigatório'
        })
      }

      if (!product_id || !product_name || !product_price) {
        return res.status(400).json({
          success: false,
          error: 'Dados do produto são obrigatórios (product_id, product_name, product_price)'
        })
      }

      // Monta payload para ZuckPay
      const payload = {
        tid: tid,
        product_id: product_id,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      }

      console.log('Processando upsell ZuckPay:', payload)

      const response = await fetch(`${ZUCKPAY_API_URL}/upsell.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader()
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      console.log('Resposta ZuckPay Upsell:', data)

      if (!response.ok || !data.success) {
        // Se falhar, pode ser que precise de 3DS ou cartão não suporta
        return res.status(200).json({
          success: false,
          requires_action: data.requires_action || false,
          payment_intent_client_secret: data.payment_intent_client_secret,
          error: data.error || data.message || 'Não foi possível processar o upsell'
        })
      }

      // Sucesso!
      return res.status(200).json({
        success: true,
        transaction_id: data.transaction_id,
        status: data.status,
        message: 'Upsell processado com sucesso!'
      })

    } catch (error) {
      console.error('Erro ao processar upsell:', error)
      return res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
