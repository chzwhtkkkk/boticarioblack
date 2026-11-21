// API Route: Testar integração com DiaLOG
// POST /api/dialog/test

import { sendDialogTracking } from '../utils/sendDialogTracking.js'

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('🧪 Testando integração DiaLOG...')

    // Payload de teste
    const testOrder = {
      order_id: `TESTE-${Date.now()}`,
      status: 'paid',
      external_reference: `TESTE-${Date.now()}`,
      customer: {
        name: 'Cliente Teste',
        email: 'teste@oboticario.com.br',
        phone: '+5511999999999',
        document: '12345678900'
      },
      shipping_address: {
        street: 'Rua Teste',
        number: '123',
        complement: 'Apto 45',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipcode: '01000-000',
        country: 'BR'
      },
      products: [
        {
          name: 'Produto Teste',
          price: 99.90,
          quantity: 1,
          weight: 0.5
        }
      ],
      total: 99.90
    }

    // Enviar para DiaLOG
    const result = await sendDialogTracking(testOrder)

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Teste enviado com sucesso!',
        statusCode: result.statusCode,
        response: result.responseBody
      })
    } else {
      return res.status(200).json({
        success: false,
        message: 'DiaLOG retornou erro',
        statusCode: result.statusCode,
        response: result.responseBody
      })
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
