// Serviço para gerenciar UTMs de forma persistente

const UTM_STORAGE_KEY = 'campaign_utms'
const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']

// Captura UTMs da URL e salva no localStorage
export const captureUtms = () => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const utms = {}
    let hasUtms = false

    UTM_PARAMS.forEach(param => {
      const value = urlParams.get(param)
      if (value) {
        utms[param] = value
        hasUtms = true
      }
    })

    if (hasUtms) {
      localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utms))
      return utms
    }

    return null
  } catch (error) {
    return null
  }
}

// Recupera UTMs salvas do localStorage
export const getStoredUtms = () => {
  try {
    const stored = localStorage.getItem(UTM_STORAGE_KEY)
    if (stored) {
      const utms = JSON.parse(stored)
      return utms
    }
    return null
  } catch (error) {
    return null
  }
}

// Limpa UTMs salvas (opcional, usar após conversão se quiser)
export const clearUtms = () => {
  try {
    localStorage.removeItem(UTM_STORAGE_KEY)
  } catch (error) {
    // Silent fail
  }
}

// Inicializa captura de UTMs (chamar no App.jsx)
export const initUtmTracking = () => {
  // Captura UTMs da URL atual
  captureUtms()
  
  // Também tenta capturar do script da Utmify se existir
  try {
    const utmifyUtms = localStorage.getItem('uf_utm_params')
    if (utmifyUtms) {
      const parsed = JSON.parse(utmifyUtms)
      const stored = getStoredUtms()
      
      // Se não tem UTMs salvas, usa as da Utmify
      if (!stored && parsed) {
        localStorage.setItem(UTM_STORAGE_KEY, utmifyUtms)
      }
    }
  } catch (e) {
    // Silent fail
  }
}
