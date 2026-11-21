// API Route: Webhook Avenpay
// POST /api/webhooks/avenpay
// Recebe notificações de mudança de status de pagamento

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://onscojkssuytbqzqgafu.supabase.co'
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uc2Nvamtzc3V5dGJxenFnYWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MjgzNDgsImV4cCI6MjA1MDIwNDM0OH0.tu_anu2vYr-vjsjKoGA7mN5vKSN3bYZP1m9wpUL98w8'
const DIALOG_WEBHOOK_URL = 'https://dnpgrcriaqpcybhzikvh.supabase.co/functions/v1/webhook-checkout/universal/c688fd32-379c-425e-a8ad-cc600ad69539?token=d04d15b2b59f4363a9064194ecb413973e46cc80249b43318d6c72f0f9ce93ae'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const payment = req.body
    const event = req.headers['x-webhook-event']

    console.log('📨 Webhook recebido:', event)
    console.log('📦 Payload:', JSON.stringify(payment, null, 2))

    // Extrair dados do metadata extra (cart e address)
    let cart = []
    let address = null
    if (payment.metadata?.extra) {
      try {
        const extra = JSON.parse(payment.metadata.extra)
        cart = extra.cart || []
        address = extra.address || null
      } catch (e) {
        console.error('❌ Erro ao parsear metadata.extra:', e)
      }
    }

    // Se pagamento foi aprovado, salvar no Supabase
    if (payment.status === 'PAID' && event === 'payment.paid') {
      console.log('✅ Pagamento aprovado! Salvando no Supabase...')

      // 1. Criar/buscar cliente
      const customerData = {
        name: payment.payer.name,
        email: payment.payer.email,
        phone: payment.payer.phone || null,
        cpf: payment.payer.taxId
      }

      const customerResponse = await fetch(`${SUPABASE_URL}/rest/v1/customers?cpf=eq.${customerData.cpf}`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      })

      let customer
      const existingCustomers = await customerResponse.json()

      if (existingCustomers && existingCustomers.length > 0) {
        customer = existingCustomers[0]
        console.log('👤 Cliente existente:', customer.id)
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
        customer = newCustomers[0]
        console.log('👤 Cliente criado:', customer.id)
      }

      // 2. Criar pedido
      const orderData = {
        customer_id: customer.id,
        total: payment.amount / 100, // Converter de centavos pra reais
        status: 'paid',
        payment_method: 'pix',
        payment_id: payment.id,
        external_ref: payment.externalRef,
        paid_at: payment.paidAt,
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
      const order = orders[0]
      console.log('📦 Pedido criado:', order.id)

      // 3. Criar itens do pedido
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

      // 4. Enviar para DiaLOG
      console.log('📤 Enviando para DiaLOG webhook...')
      try {
        const dialogPayload = {
          event: 'payment.paid',
          payment_id: payment.id,
          order_id: order.id,
          external_ref: payment.externalRef,
          customer: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            cpf: customer.cpf
          },
          amount: payment.amount / 100,
          status: payment.status,
          paid_at: payment.paidAt,
          items: cart,
          address: address
        }

        const dialogResponse = await fetch(DIALOG_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dialogPayload)
        })

        if (dialogResponse.ok) {
          console.log('✅ DiaLOG notificado com sucesso')
        } else {
          console.error('❌ Erro ao notificar DiaLOG:', dialogResponse.status)
        }

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
            payload: dialogPayload,
            response_status: dialogResponse.status,
            response_body: await dialogResponse.text()
          })
        })
      } catch (dialogError) {
        console.error('❌ Erro ao enviar para DiaLOG:', dialogError)
      }
    }

    // Retornar 200 sempre pro webhook não tentar reenviar
    return res.status(200).json({ received: true })

  } catch (error) {
    console.error('❌ Erro no webhook:', error)
    console.error('Stack:', error.stack)
    // Retornar 200 mesmo com erro pra não ficar reenviando
    return res.status(200).json({ received: true, error: error.message })
  }
}
