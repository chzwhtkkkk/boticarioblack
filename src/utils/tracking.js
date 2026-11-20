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
  const contentIds = orderData.items.map(item => item.id)
  const contents = orderData.items.map(item => ({
    id: item.id,
    quantity: item.quantity,
    item_price: item.price
  }))

  trackEvent('Purchase', {
    content_ids: contentIds,
    contents: contents,
    value: orderData.total,
    currency: 'BRL',
    num_items: orderData.items.reduce((sum, item) => sum + item.quantity, 0),
    order_id: orderData.orderId
  })
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
