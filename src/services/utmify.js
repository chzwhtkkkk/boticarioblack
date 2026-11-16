// Serviço de rastreamento Utmify

// Rastrear visualização de produto
export const trackViewContent = (product) => {
  if (window.uf && window.uf.pxl) {
    window.uf.pxl('track', 'ViewContent', {
      content_name: product.name,
      content_category: product.category,
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: 'BRL'
    })
  }
}

// Rastrear adição ao carrinho
export const trackAddToCart = (product, quantity = 1) => {
  if (window.uf && window.uf.pxl) {
    window.uf.pxl('track', 'AddToCart', {
      content_name: product.name,
      content_ids: [product.id],
      content_type: 'product',
      value: product.price * quantity,
      currency: 'BRL'
    })
  }
}

// Rastrear início do checkout
export const trackInitiateCheckout = (cart, total) => {
  try {
    if (window.uf && window.uf.pxl) {
      const eventData = {
        content_ids: cart.map(item => item.id),
        contents: cart.map(item => ({
          id: item.id,
          quantity: item.quantity,
          item_price: item.price
        })),
        value: total,
        currency: 'BRL',
        num_items: cart.reduce((sum, item) => sum + item.quantity, 0)
      }
      
      window.uf.pxl('track', 'InitiateCheckout', eventData)
    }
  } catch (error) {
    // Silent fail
  }
}

// Rastrear compra finalizada
export const trackPurchase = (orderId, cart, total) => {
  const sendPurchase = () => {
    if (window.uf && window.uf.pxl) {
      // Captura as UTMs salvas pelo script da Utmify
      const utmParams = {}
      
      // Tenta pegar as UTMs do localStorage (onde a Utmify salva)
      try {
        const savedUtms = localStorage.getItem('uf_utm_params')
        
        if (savedUtms) {
          const utms = JSON.parse(savedUtms)
          if (utms.utm_source) utmParams.utm_source = utms.utm_source
          if (utms.utm_medium) utmParams.utm_medium = utms.utm_medium
          if (utms.utm_campaign) utmParams.utm_campaign = utms.utm_campaign
          if (utms.utm_content) utmParams.utm_content = utms.utm_content
          if (utms.utm_term) utmParams.utm_term = utms.utm_term
        }
      } catch (e) {
        // Silent fail
      }
      
      const eventData = {
        content_ids: cart.map(item => item.id),
        contents: cart.map(item => ({
          id: item.id,
          quantity: item.quantity,
          item_price: item.price
        })),
        value: total,
        currency: 'BRL',
        transaction_id: orderId,
        num_items: cart.reduce((sum, item) => sum + item.quantity, 0),
        ...utmParams // Adiciona as UTMs ao evento
      }
      
      window.uf.pxl('track', 'Purchase', eventData)
      return true
    }
    return false
  }
  
  // Tenta enviar imediatamente
  if (sendPurchase()) {
    return
  }
  
  // Se não conseguiu, tenta novamente com múltiplas tentativas
  let attempts = 0
  const maxAttempts = 5
  const retryInterval = setInterval(() => {
    attempts++
    
    if (sendPurchase()) {
      clearInterval(retryInterval)
    } else if (attempts >= maxAttempts) {
      clearInterval(retryInterval)
    }
  }, 1000) // Tenta a cada 1 segundo, até 5 vezes
}

// Rastrear lead (quando cliente preenche dados)
export const trackLead = (customerData) => {
  if (window.uf && window.uf.pxl) {
    window.uf.pxl('track', 'Lead', {
      content_name: 'Checkout Form',
      value: 0,
      currency: 'BRL'
    })
  }
}
