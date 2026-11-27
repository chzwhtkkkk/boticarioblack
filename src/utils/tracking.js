// Meta Pixel & UTMify Tracking Helper

export const trackEvent = (eventName, params = {}) => {
  // Meta Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params)
    console.log('📊 Meta Pixel:', eventName, params)
  }

  // UTMify Pixel
  if (typeof window !== 'undefined' && window.pixel) {
    window.pixel(eventName, params)
    console.log('📊 UTMify:', eventName, params)
  }
}

export const trackPageView = () => {
  trackEvent('PageView')
}

export const trackViewContent = (product) => {
  trackEvent('ViewContent', {
    content_name: product.name,
    content_ids: [product.id],
    content_type: 'product',
    value: product.price,
    currency: 'BRL'
  })
}

export const trackAddToCart = (product, quantity = 1) => {
  trackEvent('AddToCart', {
    content_name: product.name,
    content_ids: [product.id],
    content_type: 'product',
    value: product.price * quantity,
    currency: 'BRL',
    quantity: quantity
  })
}

export const trackInitiateCheckout = (cartItems, total) => {
  const contentIds = cartItems.map(item => item.id)
  const contents = cartItems.map(item => ({
    id: item.id,
    quantity: item.quantity,
    item_price: item.price
  }))

  trackEvent('InitiateCheckout', {
    content_ids: contentIds,
    contents: contents,
    value: total,
    currency: 'BRL',
    num_items: cartItems.reduce((sum, item) => sum + item.quantity, 0)
  })
}

export const trackPurchase = (orderData) => {
  // Validar se tem valor válido (maior que 0)
  if (!orderData.total || orderData.total <= 0) {
    console.warn('⚠️ Purchase event não enviado: valor inválido ou zero', orderData.total)
    return
  }

  const items = orderData.items || []
  const contentIds = items.length > 0 ? items.map(item => item.id) : []
  const contents = items.length > 0 ? items.map(item => ({
    id: item.id,
    quantity: item.quantity || 1,
    item_price: item.price || 0
  })) : []

  const purchaseData = {
    value: parseFloat(orderData.total), // Garantir que é número
    currency: 'BRL',
    order_id: orderData.orderId
  }

  // Adicionar content_ids e contents apenas se houver itens
  if (contentIds.length > 0) {
    purchaseData.content_ids = contentIds
    purchaseData.contents = contents
    purchaseData.num_items = items.reduce((sum, item) => sum + (item.quantity || 1), 0)
  }

  console.log('💰 Enviando Purchase event:', purchaseData)
  trackEvent('Purchase', purchaseData)
}

export const trackSearch = (searchTerm) => {
  trackEvent('Search', {
    search_string: searchTerm
  })
}

export const trackLead = (formData) => {
  trackEvent('Lead', {
    content_name: 'Contact Form',
    ...formData
  })
}

// Capturar UTMs do UTMify
export const getUTMs = () => {
  if (typeof window !== 'undefined' && window.UtmifyJS) {
    return window.UtmifyJS.getUtms()
  }
  return null
}

// Capturar Subids do UTMify
export const getSubids = () => {
  if (typeof window !== 'undefined' && window.UtmifyJS) {
    return window.UtmifyJS.getSubids()
  }
  return null
}
