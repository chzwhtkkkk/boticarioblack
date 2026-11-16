// Serviço para criar pagamento PIX via ZuckPay

export const createPixPayment = async (orderData) => {
  try {
    // URL da function do Netlify
    const apiUrl = '/.netlify/functions/pix'
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Erro ao gerar PIX')
    }

    return result
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}
