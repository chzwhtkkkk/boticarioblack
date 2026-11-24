import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { order_id } = req.query

    if (!order_id) {
      return res.status(400).json({ error: 'order_id is required' })
    }

    // Buscar pedido
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        customer:customers(name, email, phone, tax_id)
      `)
      .eq('external_ref', order_id)
      .single()

    if (orderError) {
      console.error('Erro ao buscar pedido:', orderError)
      return res.status(404).json({ error: 'Order not found' })
    }

    // Buscar itens do pedido
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id)

    if (itemsError) {
      console.error('Erro ao buscar itens:', itemsError)
    }

    // Retornar dados completos
    return res.status(200).json({
      ...order,
      items: items || []
    })

  } catch (error) {
    console.error('Erro ao processar requisição:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    })
  }
}
