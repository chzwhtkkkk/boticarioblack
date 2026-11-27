import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { trackPurchase } from '../utils/tracking'

const Sucesso = () => {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order_id')
  const transactionId = searchParams.get('transaction_id')
  const [orderData, setOrderData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Buscar dados do pedido primeiro
    if (orderId) {
      fetchOrderData(orderId)
    }
  }, [orderId])

  // Disparar evento de conversão após carregar os dados do pedido
  // IMPORTANTE: Só dispara se não foi disparado já no PaymentPix
  useEffect(() => {
    if (orderData && orderId && !sessionStorage.getItem(`purchase_tracked_${orderId}`)) {
      // ⚠️ VALIDAÇÃO: Só dispara se tiver total válido > 0
      if (!orderData.total || orderData.total <= 0) {
        console.warn('⚠️ Purchase não enviado na página Sucesso: total inválido', orderData.total)
        return
      }

      // Marcar como rastreado para evitar duplicação
      sessionStorage.setItem(`purchase_tracked_${orderId}`, 'true')
      
      console.log('📊 Disparando Purchase da página Sucesso (fallback)')
      
      // Disparar com dados reais do pedido
      trackPurchase({
        orderId: orderId,
        items: orderData.items || [],
        total: parseFloat(orderData.total) // Garantir que é número
      })
      console.log('🎯 Conversão rastreada para pedido:', orderId, 'Total:', orderData.total)
    }
  }, [orderData, orderId])

  const fetchOrderData = async (id) => {
    try {
      const response = await fetch(`/api/orders/get-order?order_id=${id}`)
      if (response.ok) {
        const data = await response.json()
        setOrderData(data)
      }
    } catch (error) {
      console.error('Erro ao buscar pedido:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return new Date().toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    return new Date(date).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Código copiado!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Mobile */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-4">
        <Link to="/" className="text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">O BOTICÁRIO</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 pb-24">
        {/* Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Acompanhe seu Pedido</h2>
          <p className="text-sm text-gray-600">
            Pedido #{orderId || 'ORD-...'}
          </p>
        </div>

        {/* Tracking Code Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <p className="text-sm text-gray-600 mb-2">Código de Rastreio</p>
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
            <span className="text-lg font-bold text-gray-900">BR123456789BR</span>
            <button
              onClick={() => copyToClipboard('BR123456789BR')}
              className="bg-[#246c61] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1d5850] transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copiar
            </button>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            {/* Pedido Realizado */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-12 h-12 bg-[#246c61] rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-900 text-center">Pedido Realizado</p>
              <p className="text-xs text-gray-500">{formatDate(orderData?.created_at)}</p>
            </div>

            {/* Line */}
            <div className="flex-1 h-0.5 bg-[#246c61] mx-2 mt-[-30px]"></div>

            {/* Pagamento Confirmado */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-12 h-12 bg-[#246c61] rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-900 text-center">Pagamento Confirmado</p>
              <p className="text-xs text-gray-500">{formatDate(orderData?.paid_at)}</p>
            </div>

            {/* Line */}
            <div className="flex-1 h-0.5 bg-[#246c61] mx-2 mt-[-30px]"></div>

            {/* Pedido Postado */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-12 h-12 bg-[#246c61] rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-900 text-center">Pedido Postado</p>
              <p className="text-xs text-gray-500">Prev: 25/11</p>
            </div>

            {/* Line */}
            <div className="flex-1 h-0.5 bg-gray-200 mx-2 mt-[-30px]"></div>

            {/* Em Trânsito */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-500 text-center">Em Trânsito</p>
              <p className="text-xs text-gray-400">Prev: 25/11</p>
            </div>

            {/* Line */}
            <div className="flex-1 h-0.5 bg-gray-200 mx-2 mt-[-30px]"></div>

            {/* Entregue */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-500 text-center">Entregue</p>
              <p className="text-xs text-gray-400">Prev: 25/11</p>
            </div>
          </div>

          {/* Current Status Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-[#246c61] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 mb-1">Seu pedido está a caminho</p>
              <p className="text-sm text-gray-700">Previsão de entrega: 25/11/2024</p>
              <p className="text-sm text-blue-700 font-medium mt-2">✉️ Verifique seu email para mais detalhes</p>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {orderData?.shipping_address && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Endereço de Entrega</h3>
            <div className="text-sm text-gray-700">
              <p>{orderData.shipping_address.street}, {orderData.shipping_address.number}</p>
              {orderData.shipping_address.complement && <p>{orderData.shipping_address.complement}</p>}
              <p>{orderData.shipping_address.neighborhood}</p>
              <p>{orderData.shipping_address.city} - {orderData.shipping_address.state}</p>
              <p>CEP: {orderData.shipping_address.zipcode}</p>
            </div>
          </div>
        )}

        {/* Products */}
        {orderData?.items && orderData.items.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Produtos</h3>
            <div className="space-y-4">
              {orderData.items.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.product_name}</p>
                    <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-1 gap-3">
          <Link
            to="/produtos"
            className="bg-[#246c61] hover:bg-[#1d5850] text-white font-medium py-4 px-6 rounded-lg transition-colors text-center"
          >
            Continuar Comprando
          </Link>
          <Link
            to="/area-cliente"
            className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-4 px-6 rounded-lg border border-gray-300 transition-colors text-center"
          >
            Ver Todos os Pedidos
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Sucesso
