// API Route: Salvar pedido após pagamento confirmado
// POST /api/avenpay/save-order

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://onscojkssuytbqzqgafu.supabase.co'
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uc2Nvamtzc3V5dGJxenFnYWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MjgzNDgsImV4cCI6MjA1MDIwNDM0OH0.tu_anu2vYr-vjsjKoGA7mN5vKSN3bYZP1m9wpUL98w8'
const DIALOG_WEBHOOK_URL = process.env.DIALOG_WEBHOOK_URL || 'https://dnpgrcriaqpcybhzikvh.supabase.co/functions/v1/webhook-checkout/universal/c688fd32-379c-425e-a8ad-cc600ad69539?token=d04d15b2b59f4363a9064194ecb413973e46cc80249b43318d6c72f0f9ce93ae'

// Função para enviar ao DiaLOG
async function sendDialogTracking(order) {
  try {
    const payload = {
      order_id: order.order_id,
      status: order.status || 'paid',
      external_reference: order.external_reference || order.order_id,
      customer: {
        name: order.customer.name,
        email: order.customer.email,
        phone: order.customer.phone || '',
        document: order.customer.document || ''
      },
      shipping_address: order.shipping_address,
      products: order.products,
      total: parseFloat(order.total)
    }

    const response = await fetch(DIALOG_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const statusCode = response.status
    const responseBody = await response.text()

    return {
      success: response.ok,
      statusCode,
      responseBody
    }
  } catch (error) {
    return {
      success: false,
      statusCode: 0,
      responseBody: error.message
    }
  }
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { payment_id, customer, cart, address } = req.body

    console.log('💾 Salvando pedido:', payment_id)

    // Verificar se já existe pedido com esse payment_id
    const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/orders?payment_id=eq.${payment_id}`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    const existingOrders = await checkResponse.json()
    if (existingOrders && existingOrders.length > 0) {
      console.log('⚠️ Pedido já existe, pulando...')
      return res.status(200).json({ success: true, message: 'Pedido já existe', order_id: existingOrders[0].id })
    }

    // 1. Criar/buscar cliente
    const customerData = {
      name: customer.name,
      email: customer.email,
      phone: customer.phone || null,
      cpf: customer.document || customer.cpf
    }

    const customerResponse = await fetch(`${SUPABASE_URL}/rest/v1/customers?cpf=eq.${customerData.cpf}`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    let customerRecord
    const existingCustomers = await customerResponse.json()

    if (existingCustomers && existingCustomers.length > 0) {
      customerRecord = existingCustomers[0]
      console.log('👤 Cliente existente:', customerRecord.id)
    } else {
      // Criar novo cliente
      const createCustomerResponse = await fetch(`${SUPABASE_URL}/rest/v1/customers`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(customerData)
      })

      const newCustomers = await createCustomerResponse.json()
      
      if (!newCustomers || newCustomers.length === 0) {
        console.error('❌ Falha ao criar cliente, resposta vazia do Supabase')
        throw new Error('Falha ao criar cliente no Supabase')
      }
      
      customerRecord = newCustomers[0]
      console.log('👤 Cliente criado:', customerRecord.id)
    }
    
    if (!customerRecord || !customerRecord.id) {
      throw new Error('Cliente não encontrado ou criado')
    }

    // 2. Calcular total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    // 3. Criar pedido
    const orderData = {
      customer_id: customerRecord.id,
      total: total,
      status: 'paid',
      payment_method: 'pix',
      payment_id: payment_id,
      external_ref: `ORD-${Date.now()}`,
      paid_at: new Date().toISOString(),
      shipping_address: address ? JSON.stringify(address) : null
    }

    const createOrderResponse = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(orderData)
    })

    const orders = await createOrderResponse.json()
    
    if (!orders || orders.length === 0) {
      console.error('❌ Falha ao criar pedido, resposta vazia do Supabase')
      console.error('Response status:', createOrderResponse.status)
      console.error('Response body:', orders)
      throw new Error('Falha ao criar pedido no Supabase')
    }
    
    const order = orders[0]
    console.log('📦 Pedido criado:', order.id)

    // 4. Criar itens do pedido
    if (cart && cart.length > 0) {
      for (const item of cart) {
        const itemData = {
          order_id: order.id,
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity || 1,
          price: item.price
        }

        await fetch(`${SUPABASE_URL}/rest/v1/order_items`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(itemData)
        })
      }
      console.log(`📦 ${cart.length} itens adicionados ao pedido`)
    }

    // 5. Enviar para DiaLOG
    console.log('📤 Enviando para DiaLOG...')
    
    const dialogOrder = {
      order_id: orderData.external_ref,
      status: 'paid',
      external_reference: orderData.external_ref,
      customer: {
        name: customerRecord.name,
        email: customerRecord.email,
        phone: customerRecord.phone || '',
        document: customerRecord.cpf
      },
      shipping_address: address ? {
        street: address.street || address.address || '',
        number: address.number || '',
        complement: address.complement || '',
        neighborhood: address.neighborhood || '',
        city: address.city || '',
        state: address.state || '',
        zipcode: address.cep || address.zipcode || '',
        country: 'BR'
      } : null,
      products: cart.map(item => ({
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity || 1,
        weight: 0.5
      })),
      total: parseFloat(total.toFixed(2))
    }

    const dialogResult = await sendDialogTracking(dialogOrder)

    // Salvar log do DiaLOG
    await fetch(`${SUPABASE_URL}/rest/v1/dialog_webhook_logs`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order_id: order.id,
        status_code: dialogResult.statusCode,
        response_body: dialogResult.responseBody,
        sent_at: new Date().toISOString()
      })
    })

    if (dialogResult.success) {
      console.log(`✅ DiaLOG notificado com sucesso`)
    } else {
      console.error(`❌ Falha ao notificar DiaLOG`)
    }

    return res.status(200).json({
      success: true,
      order_id: order.id,
      external_ref: orderData.external_ref
    })

  } catch (error) {
    console.error('❌ Erro ao salvar pedido:', error)
    console.error('Stack:', error.stack)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
