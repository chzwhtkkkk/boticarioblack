// API de teste para verificar conectividade e credenciais ZuckPay

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const CLIENT_ID = 'chzwhtkkk_8839467085'
    const CLIENT_SECRET = 'e376192121b3798f43d33023a0b8162d801d9a7ca250f2e3ac2df7e110c6ed20'

    // Teste 1: Verificar se a API está respondendo
    const testData = {
      nome: 'Cliente Teste',
      cpf: '00000000000',
      valor: 10.00,
      email: 'teste@teste.com',
      telefone: '11999998888'
    }

    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')

    // Fazer requisição real para ZuckPay
    const response = await fetch('https://zuckpay.com.br/conta/v3/pix/qrcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify(testData)
    })

    const data = await response.json()

    return res.status(200).json({
      success: true,
      message: 'API de teste funcionando!',
      zuckpayStatus: response.status,
      zuckpayResponse: data,
      credentials: {
        clientId: CLIENT_ID,
        secretLength: CLIENT_SECRET.length,
        authHeader: `Basic ${auth.substring(0, 20)}...`
      }
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    })
  }
}
