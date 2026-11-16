// Webhook conforme documentação ZuckPay

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Payload conforme documentação ZuckPay
    const { event, platform, transaction, timestamp } = req.body

    console.log('═══════════════════════════════════════')
    console.log('🔔 WEBHOOK ZUCKPAY')
    console.log('Event:', event)
    console.log('Platform:', platform)
    console.log('Timestamp:', timestamp)
    console.log('───────────────────────────────────────')
    console.log('Transaction ID:', transaction?.id)
    console.log('Status:', transaction?.status)
    console.log('Payment Method:', transaction?.payment_method)
    console.log('Order ID:', transaction?.external_id_client)
    console.log('Amount:', transaction?.amount)
    console.log('Customer:', transaction?.nome)
    console.log('Email:', transaction?.email)
    console.log('═══════════════════════════════════════')

    // Conforme documentação: event = "payment_approved" e status = "PAID"
    if (event === 'payment_approved' && transaction?.status === 'PAID') {
      console.log('✅ PAGAMENTO APROVADO!')
      console.log('Pedido:', transaction.external_id_client)
      console.log('Valor:', transaction.amount)
      console.log('Data confirmação:', transaction.confirmed_date)
      
      // Aqui você processa o pagamento aprovado
      // - Atualizar banco de dados
      // - Enviar email
      // - Disparar eventos de conversão
    }

    // Retorna 200 OK conforme boas práticas da documentação
    return res.status(200).json({
      success: true,
      message: 'Webhook processado'
    })
  } catch (error) {
    console.error('❌ Erro no webhook:', error)
    // Retorna 200 mesmo com erro para não ficar reenviando
    return res.status(200).json({
      success: false,
      error: error.message
    })
  }
}
