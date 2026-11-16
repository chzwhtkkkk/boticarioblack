// Serviço de rastreamento Meta Pixel (Facebook/Instagram Ads)

// Função para capturar o Facebook Click ID (fbc) da URL ou cookie
export const getFbcParam = () => {
  try {
    // Tenta pegar da URL
    const urlParams = new URLSearchParams(window.location.search)
    const fbclid = urlParams.get('fbclid')
    
    if (fbclid) {
      // Formato: fb.1.timestamp.fbclid
      const timestamp = Date.now()
      return `fb.1.${timestamp}.${fbclid}`
    }
    
    // Tenta pegar do cookie _fbc
    const cookies = document.cookie.split(';')
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === '_fbc') {
        return value
      }
    }
    
    return null
  } catch (error) {
    return null
  }
}

// Função para capturar o Facebook Browser ID (fbp) do cookie
export const getFbpParam = () => {
  try {
    const cookies = document.cookie.split(';')
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === '_fbp') {
        return value
      }
    }
    return null
  } catch (error) {
    return null
  }
}

// Função para criar hash SHA256 (para Advanced Matching)
const hashData = async (data) => {
  if (!data) return null
  try {
    const normalized = data.toLowerCase().trim()
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(normalized)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  } catch (error) {
    return null
  }
}

// Função para configurar Advanced Matching
export const setAdvancedMatching = async (customerData) => {
  if (!window.fbq || !customerData) return
  
  try {
    const advancedMatchingData = {}
    
    // Email (hashed)
    if (customerData.email) {
      advancedMatchingData.em = await hashData(customerData.email)
    }
    
    // Telefone (hashed, apenas números)
    if (customerData.phone) {
      const phoneClean = customerData.phone.replace(/\D/g, '')
      advancedMatchingData.ph = await hashData(phoneClean)
    }
    
    // Nome (hashed)
    if (customerData.name) {
      const nameParts = customerData.name.trim().split(' ')
      advancedMatchingData.fn = await hashData(nameParts[0]) // Primeiro nome
      if (nameParts.length > 1) {
        advancedMatchingData.ln = await hashData(nameParts[nameParts.length - 1]) // Último nome
      }
    }
    
    // Cidade (hashed)
    if (customerData.city) {
      advancedMatchingData.ct = await hashData(customerData.city)
    }
    
    // Estado (hashed)
    if (customerData.state) {
      advancedMatchingData.st = await hashData(customerData.state)
    }
    
    // CEP (hashed, apenas números)
    if (customerData.cep) {
      const cepClean = customerData.cep.replace(/\D/g, '')
      advancedMatchingData.zp = await hashData(cepClean)
    }
    
    // País (sempre BR)
    advancedMatchingData.country = await hashData('br')
    
    // Atualiza o pixel com Advanced Matching
    window.fbq('init', '996548406361699', advancedMatchingData)
    
    return advancedMatchingData
  } catch (error) {
    return null
  }
}

// Rastrear visualização de produto
export const trackViewContent = (product) => {
  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
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
  if (window.fbq) {
    window.fbq('track', 'AddToCart', {
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
  if (window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_ids: cart.map(item => item.id),
      contents: cart.map(item => ({
        id: item.id,
        quantity: item.quantity,
        item_price: item.price
      })),
      value: total,
      currency: 'BRL',
      num_items: cart.reduce((sum, item) => sum + item.quantity, 0)
    })
  }
}

// Rastrear compra finalizada
export const trackPurchase = (orderId, cart, total, customerData = null) => {
  if (window.fbq) {
    const fbc = getFbcParam()
    const fbp = getFbpParam()
    
    const purchaseData = {
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
    
    // Adiciona fbc e fbp se disponíveis
    if (fbc) {
      purchaseData.fbc = fbc
    }
    if (fbp) {
      purchaseData.fbp = fbp
    }
    
    // Envia com event_id único para deduplicação
    window.fbq('track', 'Purchase', purchaseData, {
      eventID: orderId // Usa orderId como event_id único
    })
  }
}

// Rastrear lead (quando cliente preenche dados)
export const trackLead = (customerData) => {
  if (window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: 'Checkout Form',
      value: 0,
      currency: 'BRL'
    })
  }
}
