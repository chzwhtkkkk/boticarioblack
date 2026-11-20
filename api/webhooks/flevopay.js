// Webhook: Receber notificações da FlevoPay
// POST /api/webhooks/flevopay

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://onscojkssuytbqzqgafu.supabase.co'
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uc2Nvamtzc3V5dGJxenFnYWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ5MzkxOTAsImV4cCI6MjExMDUxNTE5MH0.fZdoF5iBB5sQGUahfaDn_HU8rr57PZnuHyWuk-pLVQA'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const DIALOG_WEBHOOK_URL = process.env.DIALOG_WEBHOOK_URL || 'https://dnpgrcriaqpcybhzikvh.supabase.co/functions/v1/webhook-checkout/universal/c688fd32-379c-425e-a8ad-cc600ad69539?token=d04d15b2b59f4363a9064194ecb413973e46cc80249b43318d6c72f0f9ce93ae'

async function sendDialogTracking(orderData) {
  console.log('📧 Enviando rastreio para DiaLOG:', orderData.order_id)
  
  try {
    const payload = {
      order_id: orderData.order_id,
      status: 'paid',
      external_reference: orderData.order_id,
      customer: {
        name: orderData.customer.name,
        email: orderData.customer.email,
        phone: orderData.customer.phone,
        document: orderData.customer.document
      },
      shipping_address: orderData.shipping_address || {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipcode: '',
        country: 'BR'
      },
      products: orderData.products || [
        {
          name: 'Produto',
          price: parseFloat(orderData.total),
          quantity: 1,
          weight: 0.5
        }
      ],
      total: parseFloat(orderData.total)
    }

    console.log('📤 Payload DiaLOG:', JSON.stringify(payload, null, 2))

    const response = await fetch(DIALOG_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const responseText = await response.text()
    console.log('📥 Resposta DiaLOG:', response.status, responseText)

    // Log do webhook no Supabase
    try {
      await supabase.from('dialog_webhook_logs').insert({
        order_id: orderData.order_id,
        status_code: response.status,
        response_body: responseText,
        sent_at: new Date().toISOString()
      })
    } catch (logError) {
      console.error('⚠️ Erro ao logar webhook:', logError)
    }

    if (!response.ok) {
      throw new Error(`DiaLOG retornou ${response.status}: ${responseText}`)
    }

    console.log('✅ Rastreio enviado para DiaLOG com sucesso!')
    return { success: true, status: response.status, body: responseText }
    
  } catch (error) {
    console.error('❌ Erro ao enviar para DiaLOG:', error)
    
    // Log do erro
    try {
      await supabase.from('dialog_webhook_logs').insert({
        order_id: orderData.order_id,
        status_code: 0,
        response_body: JSON.stringify({ error: error.message }),
        sent_at: new Date().toISOString()
      })
    } catch (logError) {
      console.error('⚠️ Erro ao logar erro:', logError)
    }
    
    return { success: false, error: error.message }
  }
}

function generateTrackingCode() {
  const prefix = 'BR'
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.random().toString(36).substr(2, 4).toUpperCase()
  return `${prefix}${timestamp}${random}`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const webhook = req.body

    console.log('🔔 Webhook recebido:', JSON.stringify(webhook, null, 2))

    // Validar tipo de webhook
    if (webhook.webhook_type !== 'transaction') {
      console.log('ℹ️ Tipo de webhook ignorado:', webhook.webhook_type)
      return res.status(200).json({ received: true })
    }

    const { 
      transaction_id, 
      external_id, 
      status, 
      amount, 
      customer, 
      address,
      product,
      tracking: utmTracking,
      e2e_id
    } = webhook

    // Processar apenas pagamentos aprovados
    if (status === 'approved') {
      console.log('✅ Pagamento aprovado! Processando pedido...')

      // Gerar código de rastreio
      const trackingCode = generateTrackingCode()

      // Buscar dados do cliente no Supabase ou criar novo
      let customerId
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', customer.email)
        .single()

      if (existingCustomer) {
        customerId = existingCustomer.id
        console.log('👤 Cliente existente:', customerId)
      } else {
        // Criar novo cliente
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            tax_id: customer.document
          })
          .select()
          .single()

        if (customerError) throw customerError
        customerId = newCustomer.id
        console.log('👤 Novo cliente criado:', customerId)
      }

      // Criar pedido
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: customerId,
          order_number: external_id,
          status: 'processing',
          payment_status: 'paid',
          payment_method: 'PIX',
          subtotal: amount,
          shipping_fee: 0,
          total: amount,
          tracking_code: trackingCode,
          shipping_address: address || {},
          paid_at: new Date().toISOString(),
          transaction_id: transaction_id,
          e2e_id: e2e_id,
          utm_source: utmTracking?.utm_source,
          utm_medium: utmTracking?.utm_medium,
          utm_campaign: utmTracking?.utm_campaign
        })
        .select()
        .single()

      if (orderError) throw orderError
      console.log('📦 Pedido criado:', order.id)

      // TODO: Criar order_items quando tiver os produtos salvos junto com a transação
      // Por enquanto, vamos criar um item genérico
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          product_name: product?.name || 'Produto',
          quantity: 1,
          unit_price: amount,
          total_price: amount
        })

      if (itemError) console.error('⚠️ Erro ao criar order_items:', itemError)

      // Enviar para DiaLOG Rastreios
      await sendDialogTracking({
        order_id: external_id,
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          document: customer.document
        },
        shipping_address: address ? {
          street: address.street || '',
          number: address.number || '',
          complement: address.complement || '',
          neighborhood: address.neighborhood || '',
          city: address.city || '',
          state: address.state || '',
          zipcode: address.zipcode || '',
          country: 'BR'
        } : null,
        products: [
          {
            name: product?.name || 'Produto',
            price: amount / 100,
            quantity: 1,
            weight: 0.5
          }
        ],
        total: (amount / 100).toFixed(2)
      })

      console.log('🎉 Pedido processado com sucesso!')
    } else {
      console.log(`ℹ️ Status ${status} - Nenhuma ação necessária`)
    }

    // Sempre retornar 200 para confirmar recebimento
    return res.status(200).json({ received: true })

  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error)
    // Mesmo com erro, retornar 200 para evitar reenvios desnecessários
    return res.status(200).json({ received: true, error: error.message })
  }
}
