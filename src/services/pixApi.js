// Serviço para criar pagamento PIX via Avenpay

export const createPixPayment = async (orderData) => {
  try {
    // URL da API Vercel
    const apiUrl = '/api/orders/create'
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Erro ao gerar pagamento')
    }

    return result
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}
