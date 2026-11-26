// API Route: Webhook Avenpay
// POST /api/webhooks/avenpay
// Recebe notificações de mudança de status de pagamento
// Documentação: https://api.avenpayments.com/v1/ (atualizada 2026)
// 
// Headers importantes:
// - X-Webhook-Event: payment.created | payment.paid | payment.refused | payment.refunded
// - X-Signature: HMAC SHA-256 signature (opcional, para validação)
//
// ⚠️ PROIBIDO fazer polling em GET /v1/payment/:id
// Status DEVE ser consumido via webhook obrigatoriamente

import { sendDialogTrackingWithRetry } from '../utils/sendDialogTracking.js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://onscojkssuytbqzqgafu.supabase.co'
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uc2Nvamtzc3V5dGJxenFnYWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MjgzNDgsImV4cCI6MjA1MDIwNDM0OH0.tu_anu2vYr-vjsjKoGA7mN5vKSN3bYZP1m9wpUL98w8'
const WEBHOOK_SECRET = process.env.AVENPAY_WEBHOOK_SECRET || null // Para validar X-Signature (se configurado no dashboard)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const payment = req.body
    const event = req.headers['x-webhook-event'] // payment.created | payment.paid | payment.refused | payment.refunded
    const signature = req.headers['x-signature'] // Base64 HMAC SHA-256 (opcional)

    console.log('📨 Webhook recebido - Event:', event)
    console.log('📨 Payment ID:', payment.id)
    console.log('📨 Status:', payment.status)

    // Validar assinatura se WEBHOOK_SECRET estiver configurado
    if (WEBHOOK_SECRET && signature) {
      const crypto = require('crypto')
      const bodyString = JSON.stringify(payment)
      const expectedSignature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(bodyString)
        .digest('base64')
      
      if (signature !== expectedSignature) {
        console.error('❌ Assinatura inválida! Webhook pode não ser autêntico.')
        return res.status(401).json({ error: 'Invalid signature' })
      }
      console.log('✅ Assinatura validada')
    }

    // Status possíveis: PENDING | PROCESSING | PAID | REFUSED | REFUNDED | MED | CHARGEDBACK
    // Events possíveis: payment.created | payment.paid | payment.refused | payment.refunded

    // Extrair dados do metadata extra (cart e address) - formato customizado
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

    // Processar apenas eventos de pagamento confirmado
    // Event: payment.paid sempre vem com status: PAID
    if (payment.status === 'PAID' && event === 'payment.paid') {
      console.log('✅ Pagamento confirmado! Salvando no Supabase...')

      // Verificar se pedido já existe (idempotência - webhook pode chegar mais de uma vez)
      const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/orders?payment_id=eq.${payment.id}`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      })

      const existingOrders = await checkResponse.json()
      if (existingOrders && existingOrders.length > 0) {
        console.log('⚠️ Pedido já existe (webhook duplicado), ignorando...')
        return res.status(200).json({ received: true, message: 'Order already exists' })
      }

      // 1. Criar/buscar cliente
      const customerData = {
        name: payment.payer.name,
        email: payment.payer.email,
        phone: payment.payer.phone || null,
        tax_id: payment.payer.taxId
      }

      const customerResponse = await fetch(`${SUPABASE_URL}/rest/v1/customers?tax_id=eq.${customerData.tax_id}`, {
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
        
        if (!newCustomers || newCustomers.length === 0) {
          console.error('❌ Falha ao criar cliente')
          throw new Error('Falha ao criar cliente no Supabase')
        }
        
        customer = newCustomers[0]
        console.log('👤 Cliente criado:', customer.id)
      }
      
      if (!customer || !customer.id) {
        throw new Error('Cliente não encontrado ou criado')
      }

      // 2. Criar pedido com dados atualizados da API v1
      const orderData = {
        customer_id: customer.id,
        total: payment.amount / 100, // Converter de centavos pra reais
        status: 'paid',
        payment_method: payment.method.toLowerCase(), // pix | credit_card | boleto
        payment_id: payment.id,
        external_ref: payment.externalRef,
        paid_at: payment.paidAt, // ISO 8601 UTC
        shipping_address: address ? JSON.stringify(address) : null,
        // Novos campos da v1 API
        fees: payment.fees ? JSON.stringify(payment.fees) : null, // { amount, payFeeAmount, chkFeeAmount, memFeeAmount }
        installments: payment.installments || 1,
        currency: payment.currency || 'BRL'
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
        console.error('❌ Falha ao criar pedido')
        console.error('Response:', orders)
        throw new Error('Falha ao criar pedido no Supabase')
      }
      
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

      // 4. Enviar para DiaLOG (com retry automático)
      console.log('📤 Enviando para DiaLOG webhook...')
      
      const dialogOrder = {
        order_id: payment.externalRef,
        status: 'paid',
        external_reference: payment.externalRef,
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone || '',
          document: customer.cpf
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
        total: parseFloat((payment.amount / 100).toFixed(2))
      }

      const dialogResult = await sendDialogTrackingWithRetry(dialogOrder, 3)

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
        console.log(`✅ DiaLOG notificado com sucesso (${dialogResult.attempts} tentativas)`)
      } else {
        console.error(`❌ Falha ao notificar DiaLOG após ${dialogResult.attempts} tentativas`)
      }
    }

    // Sempre retornar 200 para confirmar recebimento
    // Webhook Avenpay faz retry até 6x se não receber 2xx em 30s
    // Respostas 404, 405, 410 param o retry imediatamente
    return res.status(200).json({ received: true, event, payment_id: payment.id })

  } catch (error) {
    console.error('❌ Erro no webhook:', error)
    console.error('Stack:', error.stack)
    // Retornar 200 mesmo com erro para evitar retry desnecessário
    // Se o erro for crítico, o log já foi registrado
    return res.status(200).json({ received: true, error: error.message })
  }
}
