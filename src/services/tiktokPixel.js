// Serviço de integração com TikTok Pixel

// Inicializar TikTok Pixel
export const initTikTokPixel = (pixelId) => {
  if (typeof window === 'undefined' || !window.ttq) {
    return
  }

  try {
    window.ttq.load(pixelId)
    window.ttq.page()
  } catch (error) {
    // Silent fail
  }
}

// Track PageView
export const trackPageView = () => {
  if (typeof window === 'undefined' || !window.ttq) return
  
  try {
    window.ttq.track('PageView')
  } catch (error) {
    // Silently fail
  }
}

// Track ViewContent
export const trackViewContent = (product) => {
  if (typeof window === 'undefined' || !window.ttq) return
  
  try {
    window.ttq.track('ViewContent', {
      content_type: 'product',
      content_id: product.id,
      content_name: product.name,
      price: product.price,
      currency: 'BRL'
    })
  } catch (error) {
    // Silently fail
  }
}

// Track AddToCart
export const trackAddToCart = (product, quantity = 1) => {
  if (typeof window === 'undefined' || !window.ttq) return
  
  try {
    window.ttq.track('AddToCart', {
      content_type: 'product',
      content_id: product.id,
      content_name: product.name,
      price: product.price,
      quantity: quantity,
      value: product.price * quantity,
      currency: 'BRL'
    })
  } catch (error) {
    // Silently fail
  }
}

// Track InitiateCheckout
export const trackInitiateCheckout = (cart, total) => {
  if (typeof window === 'undefined' || !window.ttq) return
  
  try {
    const contents = cart.map(item => ({
      content_id: item.id,
      content_name: item.name,
      price: item.price,
      quantity: item.quantity
    }))

    window.ttq.track('InitiateCheckout', {
      contents: contents,
      value: total,
      currency: 'BRL'
    })
  } catch (error) {
    // Silently fail
  }
}

// Track CompletePayment (Purchase)
export const trackPurchase = (orderId, cart, total) => {
  if (typeof window === 'undefined' || !window.ttq) return
  
  try {
    const contents = cart.map(item => ({
      content_id: item.id,
      content_name: item.name,
      price: item.price,
      quantity: item.quantity
    }))

    window.ttq.track('CompletePayment', {
      contents: contents,
      value: total,
      currency: 'BRL',
      order_id: orderId
    })
  } catch (error) {
    // Silently fail
  }
}

// Track SubmitForm (Lead)
export const trackLead = (formData) => {
  if (typeof window === 'undefined' || !window.ttq) return
  
  try {
    window.ttq.track('SubmitForm', {
      content_name: 'Checkout Form',
      email: formData.email,
      phone: formData.phone
    })
  } catch (error) {
    // Silently fail
  }
}
