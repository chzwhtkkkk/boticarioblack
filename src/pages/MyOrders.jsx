import { useState } from 'react'
import { formatPrice } from '../utils/formatPrice'

const MyOrders = () => {
  const [cpf, setCpf] = useState('')
  const [orders, setOrders] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  // Máscara de CPF
  const formatCpf = (value) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4')
  }

  const handleCpfChange = (e) => {
    const formatted = formatCpf(e.target.value)
    setCpf(formatted)
  }

  const searchOrders = () => {
    setLoading(true)
    setSearched(true)

    // Busca pedidos no localStorage
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    const cpfNumbers = cpf.replace(/\D/g, '')
    
    // Filtra pedidos pelo CPF
    const customerOrders = allOrders.filter(order => {
      const orderCpf = order.customer?.cpf?.replace(/\D/g, '')
      return orderCpf === cpfNumbers
    })

    // Ordena por data (mais recente primeiro)
    customerOrders.sort((a, b) => new Date(b.date) - new Date(a.date))

    setTimeout(() => {
      setOrders(customerOrders)
      setLoading(false)
    }, 500)
  }

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: {
        label: 'Aguardando Pagamento',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: '⏳'
      },
      paid: {
        label: 'Pago',
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: '✅'
      },
      processing: {
        label: 'Em Processamento',
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: '📦'
      },
      shipped: {
        label: 'Enviado',
        color: 'bg-purple-100 text-purple-800 border-purple-300',
        icon: '🚚'
      },
      delivered: {
        label: 'Entregue',
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: '🎉'
      },
      cancelled: {
        label: 'Cancelado',
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: '❌'
      }
    }
    return statusMap[status] || statusMap.pending
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <svg className="w-10 h-10 text-[#246c61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h1 className="text-4xl font-bold text-[#246c61]">Meus Pedidos</h1>
          </div>
          <p className="text-gray-600">Consulte seus pedidos informando seu CPF</p>
        </div>

        {/* Search Box */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-[#246c61]">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-[#246c61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
              <label className="text-lg font-bold text-gray-900">Digite seu CPF</label>
            </div>
            
            <div className="flex gap-3">
              <input
                type="text"
                value={cpf}
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
                maxLength="14"
                className="flex-1 px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#246c61] focus:border-[#246c61] text-lg"
              />
              <button
                onClick={searchOrders}
                disabled={cpf.replace(/\D/g, '').length !== 11}
                className="bg-gradient-to-r from-[#246c61] to-[#1d5850] hover:from-[#1d5850] hover:to-[#246c61] text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Buscar
                </span>
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-3">
              💡 Digite o CPF usado no momento da compra
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#246c61] border-t-transparent"></div>
            <p className="text-gray-600 mt-4">Buscando seus pedidos...</p>
          </div>
        )}

        {/* Results */}
        {!loading && searched && (
          <div className="max-w-5xl mx-auto">
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-gray-200">
                <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Nenhum pedido encontrado
                </h3>
                <p className="text-gray-600 mb-6">
                  Não encontramos pedidos com este CPF
                </p>
                <button
                  onClick={() => {
                    setCpf('')
                    setSearched(false)
                    setOrders([])
                  }}
                  className="text-[#246c61] hover:text-[#1d5850] font-semibold"
                >
                  ← Fazer nova busca
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {orders.length} {orders.length === 1 ? 'pedido encontrado' : 'pedidos encontrados'}
                  </h2>
                  <button
                    onClick={() => {
                      setCpf('')
                      setSearched(false)
                      setOrders([])
                    }}
                    className="text-[#246c61] hover:text-[#1d5850] font-semibold flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Nova busca
                  </button>
                </div>

                <div className="space-y-6">
                  {orders.map((order) => {
                    const statusInfo = getStatusInfo(order.status)
                    return (
                      <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200 hover:shadow-xl transition-shadow">
                        {/* Header do Pedido */}
                        <div className="bg-gradient-to-r from-[#246c61] to-[#1d5850] text-white p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <p className="text-sm opacity-90 mb-1">Pedido</p>
                              <p className="text-2xl font-bold">#{order.id}</p>
                            </div>
                            <div className="text-left md:text-right">
                              <p className="text-sm opacity-90 mb-1">Data do Pedido</p>
                              <p className="text-lg font-semibold">{formatDate(order.date)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Conteúdo do Pedido */}
                        <div className="p-6">
                          {/* Status */}
                          <div className="mb-6">
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold border-2 ${statusInfo.color}`}>
                              <span className="text-xl">{statusInfo.icon}</span>
                              {statusInfo.label}
                            </span>
                          </div>

                          {/* Produtos */}
                          <div className="mb-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                              <svg className="w-5 h-5 text-[#246c61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                              Produtos ({order.items?.length || 0})
                            </h3>
                            <div className="space-y-3">
                              {order.items?.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-lg border-2 border-[#246c61]"
                                  />
                                  <div className="flex-1">
                                    <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                                    <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                                  </div>
                                  <p className="font-bold text-[#246c61]">
                                    R$ {formatPrice(item.price * item.quantity)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Resumo de Valores */}
                          <div className="border-t-2 border-gray-200 pt-4">
                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between text-gray-700">
                                <span>Subtotal</span>
                                <span className="font-semibold">R$ {formatPrice(order.subtotal || 0)}</span>
                              </div>
                              {order.discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                  <span>Desconto</span>
                                  <span className="font-semibold">- R$ {formatPrice(order.discount)}</span>
                                </div>
                              )}
                              <div className="flex justify-between text-gray-700">
                                <span>Frete ({order.shippingOption})</span>
                                <span className="font-semibold">
                                  {order.shipping === 0 ? 'Grátis 🎁' : `R$ ${formatPrice(order.shipping)}`}
                                </span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
                              <span className="text-xl font-bold text-gray-900">Total</span>
                              <span className="text-3xl font-bold text-[#246c61]">
                                R$ {formatPrice(order.total)}
                              </span>
                            </div>
                          </div>

                          {/* Informações de Entrega */}
                          <div className="mt-6 pt-6 border-t-2 border-gray-200">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <svg className="w-5 h-5 text-[#246c61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                              Endereço de Entrega
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                              <p className="font-semibold text-gray-900 mb-2">{order.customer?.name}</p>
                              <p>{order.customer?.address}, {order.customer?.number}</p>
                              {order.customer?.complement && <p>{order.customer?.complement}</p>}
                              <p>{order.customer?.neighborhood} - {order.customer?.city}/{order.customer?.state}</p>
                              <p>CEP: {order.customer?.cep}</p>
                            </div>
                          </div>

                          {/* Forma de Pagamento */}
                          <div className="mt-6 pt-6 border-t-2 border-gray-200">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <svg className="w-5 h-5 text-[#246c61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                              Forma de Pagamento
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="font-semibold text-gray-900">
                                {order.paymentMethod === 'pix' ? '💳 PIX' : order.paymentMethod}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders
