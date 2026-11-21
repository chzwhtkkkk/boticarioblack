// Função utilitária para enviar tracking ao DiaLOG
// Formato: Universal endpoint (sem HMAC, sem headers customizados)

const DIALOG_WEBHOOK_URL = process.env.DIALOG_WEBHOOK_URL || 'https://dnpgrcriaqpcybhzikvh.supabase.co/functions/v1/webhook-checkout/universal/c688fd32-379c-425e-a8ad-cc600ad69539?token=d04d15b2b59f4363a9064194ecb413973e46cc80249b43318d6c72f0f9ce93ae'

/**
 * Envia dados de rastreamento para o DiaLOG
 * @param {Object} order - Dados do pedido
 * @param {string} order.order_id - ID único do pedido (usado para deduplicação)
 * @param {string} order.status - Status do pedido (paid, approved, completed)
 * @param {string} order.external_reference - Referência externa do pedido
 * @param {Object} order.customer - Dados do cliente
 * @param {string} order.customer.name - Nome completo
 * @param {string} order.customer.email - Email
 * @param {string} order.customer.phone - Telefone com DDD
 * @param {string} order.customer.document - CPF/CNPJ
 * @param {Object} order.shipping_address - Endereço de entrega
 * @param {Array} order.products - Lista de produtos
 * @param {number} order.total - Valor total em reais
 * @returns {Promise<{success: boolean, statusCode: number, responseBody: string}>}
 */
export async function sendDialogTracking(order) {
  try {
    console.log('📤 Enviando tracking para DiaLOG:', order.order_id)

    // Validações básicas
    if (!order.order_id) {
      throw new Error('order_id é obrigatório')
    }

    if (!order.customer?.email) {
      throw new Error('customer.email é obrigatório')
    }

    // Montar payload no formato do DiaLOG
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
      shipping_address: order.shipping_address ? {
        street: order.shipping_address.street || '',
        number: order.shipping_address.number || '',
        complement: order.shipping_address.complement || '',
        neighborhood: order.shipping_address.neighborhood || '',
        city: order.shipping_address.city || '',
        state: order.shipping_address.state || '',
        zipcode: order.shipping_address.zipcode || '',
        country: order.shipping_address.country || 'BR'
      } : null,
      products: (order.products || []).map(product => ({
        name: product.name,
        price: parseFloat(product.price),
        quantity: product.quantity || 1,
        weight: product.weight || 0.5 // Peso padrão em kg
      })),
      total: parseFloat(order.total)
    }

    console.log('📦 Payload:', JSON.stringify(payload, null, 2))

    // Enviar para DiaLOG
    const response = await fetch(DIALOG_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const statusCode = response.status
    const responseBody = await response.text()

    if (response.ok) {
      console.log('✅ DiaLOG respondeu com sucesso:', statusCode)
      console.log('📥 Resposta:', responseBody)
      return {
        success: true,
        statusCode,
        responseBody
      }
    } else {
      console.error('❌ DiaLOG retornou erro:', statusCode)
      console.error('📥 Resposta:', responseBody)
      return {
        success: false,
        statusCode,
        responseBody
      }
    }

  } catch (error) {
    console.error('❌ Erro ao enviar para DiaLOG:', error)
    return {
      success: false,
      statusCode: 0,
      responseBody: error.message
    }
  }
}

/**
 * Envia tracking com retry automático (até 3 tentativas)
 * @param {Object} order - Dados do pedido
 * @param {number} maxRetries - Número máximo de tentativas (padrão: 3)
 * @returns {Promise<{success: boolean, statusCode: number, responseBody: string, attempts: number}>}
 */
export async function sendDialogTrackingWithRetry(order, maxRetries = 3) {
  let lastResult = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`🔄 Tentativa ${attempt}/${maxRetries}`)

    lastResult = await sendDialogTracking(order)

    // Se sucesso ou erro do cliente (4xx), não retenta
    if (lastResult.success || (lastResult.statusCode >= 400 && lastResult.statusCode < 500)) {
      return { ...lastResult, attempts: attempt }
    }

    // Erro de servidor (5xx) ou rede (0): aguardar antes de retentar
    if (attempt < maxRetries) {
      const backoffTime = Math.min(1000 * Math.pow(2, attempt - 1), 10000) // Exponential backoff (1s, 2s, 4s...)
      console.log(`⏳ Aguardando ${backoffTime}ms antes de retentar...`)
      await new Promise(resolve => setTimeout(resolve, backoffTime))
    }
  }

  return { ...lastResult, attempts: maxRetries }
}
