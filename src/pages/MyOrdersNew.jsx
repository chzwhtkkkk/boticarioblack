import { useState } from 'react'
import { formatPrice } from '../utils/formatPrice'
import { Link } from 'react-router-dom'

const MyOrdersNew = () => {
  const [searchType, setSearchType] = useState('cpf') // 'cpf' ou 'email'
  const [searchValue, setSearchValue] = useState('')
  const [orders, setOrders] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Máscara de CPF
  const formatCpf = (value) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4')
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    if (searchType === 'cpf') {
      setSearchValue(formatCpf(value))
    } else {
      setSearchValue(value)
    }
  }

  const searchOrders = async () => {
    setLoading(true)
    setSearched(true)

    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://onscojkssuytbqzqgafu.supabase.co'
      const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_HAeCbLMh1pRPOhPoOklOoA_tYAdQ4x2pRE'

      console.log('🔍 Buscando pedidos...')
      console.log('URL:', SUPABASE_URL)
      console.log('Tipo de busca:', searchType)
      console.log('Valor:', searchValue)

      // Primeiro, buscar o cliente
      let customersUrl = `${SUPABASE_URL}/rest/v1/customers?select=id`
      
      if (searchType === 'cpf') {
        const cpfNumbers = searchValue.replace(/\D/g, '')
        customersUrl += `&tax_id=eq.${cpfNumbers}`
      } else {
        customersUrl += `&email=eq.${searchValue.trim().toLowerCase()}`
      }

      const customersResponse = await fetch(customersUrl, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      })

      if (!customersResponse.ok) {
        throw new Error(`Erro ao buscar cliente: ${customersResponse.status}`)
      }

      const customers = await customersResponse.json()
      console.log('👤 Clientes encontrados:', customers.length)

      if (customers.length === 0) {
        setOrders([])
        setLoading(false)
        return
      }

      // Buscar pedidos do cliente
      const customerIds = customers.map(c => c.id).join(',')
      const ordersUrl = `${SUPABASE_URL}/rest/v1/orders?select=*,customer:customers(*),items:order_items(*)&customer_id=in.(${customerIds})&order=created_at.desc`

      const ordersResponse = await fetch(ordersUrl, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      })

      if (!ordersResponse.ok) {
        throw new Error(`Erro ao buscar pedidos: ${ordersResponse.status}`)
      }

      const ordersData = await ordersResponse.json()
      console.log('📦 Pedidos encontrados:', ordersData.length)

      setOrders(ordersData || [])
    } catch (error) {
      console.error('❌ Erro ao buscar pedidos:', error)
      alert(`Erro ao buscar pedidos: ${error.message}`)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: {
        label: 'Aguardando Pagamento',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: '⏳',
        description: 'Seu pedido está aguardando confirmação do pagamento'
      },
      paid: {
        label: 'Pago',
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: '✅',
        description: 'Pagamento confirmado! Seu pedido está sendo preparado'
      },
      processing: {
        label: 'Em Processamento',
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: '📦',
        description: 'Seu pedido está sendo preparado para envio'
      },
      shipped: {
        label: 'Enviado',
        color: 'bg-purple-100 text-purple-800 border-purple-300',
        icon: '🚚',
        description: 'Seu pedido está a caminho!'
      },
      delivered: {
        label: 'Entregue',
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: '🎉',
        description: 'Pedido entregue com sucesso!'
      },
      cancelled: {
        label: 'Cancelado',
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: '❌',
        description: 'Este pedido foi cancelado'
      },
      refunded: {
        label: 'Reembolsado',
        color: 'bg-gray-100 text-gray-800 border-gray-300',
        icon: '💸',
        description: 'O valor foi reembolsado'
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

  const OrderDetails = ({ order }) => {
    const statusInfo = getStatusInfo(order.status)
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#246c61] to-[#1d5850] text-white p-6 sticky top-0 z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm opacity-90 mb-1">Detalhes do Pedido</p>
                <p className="text-2xl font-bold">{order.order_number}</p>
                <p className="text-sm opacity-90 mt-2">{formatDate(order.created_at)}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Status Timeline */}
            <div className="mb-8">
              <div className={`p-6 rounded-xl border-2 ${statusInfo.color}`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{statusInfo.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold">{statusInfo.label}</h3>
                    <p className="text-sm opacity-80">{statusInfo.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Code (se houver) */}
            {order.tracking_code && (
              <div className="mb-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <h3 className="text-lg font-bold text-blue-900">Código de Rastreio</h3>
                </div>
                <p className="text-2xl font-mono font-bold text-blue-600 mb-4">{order.tracking_code}</p>
                <Link
                  to={`/rastreio?codigo=${order.tracking_code}`}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Rastrear Pedido
                </Link>
              </div>
            )}

            {/* Produtos */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-[#246c61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Produtos ({order.items?.length || 0})
              </h3>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                    {item.product_image && (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-20 h-20 object-cover rounded-lg border-2 border-[#246c61]"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.product_name}</p>
                      <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                      <p className="text-sm text-gray-600">
                        Preço unitário: R$ {(item.unit_price / 100).toFixed(2)}
                      </p>
                    </div>
                    <p className="font-bold text-[#246c61] text-lg">
                      R$ {(item.total_price / 100).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumo de Valores */}
            <div className="mb-8 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Resumo</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">R$ {(order.subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Frete</span>
                  <span className="font-semibold">
                    {order.shipping_fee === 0 ? 'Grátis 🎁' : `R$ ${(order.shipping_fee / 100).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-[#246c61]">
                    R$ {(order.total / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Endereço de Entrega */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-[#246c61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Endereço de Entrega
              </h3>
              <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                <p className="font-semibold text-gray-900 mb-2">{order.customer.name}</p>
                <p className="text-gray-700">{order.shipping_address.street}, {order.shipping_address.number}</p>
                {order.shipping_address.complement && <p className="text-gray-700">{order.shipping_address.complement}</p>}
                <p className="text-gray-700">{order.shipping_address.neighborhood}</p>
                <p className="text-gray-700">{order.shipping_address.city}/{order.shipping_address.state}</p>
                <p className="text-gray-700">CEP: {order.shipping_address.zipCode}</p>
              </div>
            </div>

            {/* Dados do Cliente */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-[#246c61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Dados do Cliente
              </h3>
              <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200 space-y-2">
                <p className="text-gray-700"><span className="font-semibold">Nome:</span> {order.customer.name}</p>
                <p className="text-gray-700"><span className="font-semibold">Email:</span> {order.customer.email}</p>
                <p className="text-gray-700"><span className="font-semibold">Telefone:</span> {order.customer.phone}</p>
                <p className="text-gray-700"><span className="font-semibold">CPF:</span> {formatCpf(order.customer.tax_id)}</p>
              </div>
            </div>

            {/* Pagamento */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-[#246c61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Pagamento
              </h3>
              <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                <p className="font-semibold text-gray-900 mb-2">
                  {order.payment_method === 'PIX' ? '💳 PIX' : order.payment_method}
                </p>
                <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.payment_status === 'paid' ? '✅ Pago' : '⏳ Pendente'}
                </p>
                {order.paid_at && (
                  <p className="text-sm text-gray-600 mt-2">
                    Pago em: {formatDate(order.paid_at)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
          <p className="text-gray-600">Consulte seus pedidos informando seu CPF ou email</p>
        </div>

        {/* Search Box */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-[#246c61]">
            {/* Tipo de busca */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => {
                  setSearchType('cpf')
                  setSearchValue('')
                }}
                className={`flex-1 py-3 rounded-xl font-semibold transition ${
                  searchType === 'cpf'
                    ? 'bg-[#246c61] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🆔 Buscar por CPF
              </button>
              <button
                onClick={() => {
                  setSearchType('email')
                  setSearchValue('')
                }}
                className={`flex-1 py-3 rounded-xl font-semibold transition ${
                  searchType === 'email'
                    ? 'bg-[#246c61] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ✉️ Buscar por Email
              </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-[#246c61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <label className="text-lg font-bold text-gray-900">
                {searchType === 'cpf' ? 'Digite seu CPF' : 'Digite seu Email'}
              </label>
            </div>
            
            <div className="flex gap-3">
              <input
                type={searchType === 'email' ? 'email' : 'text'}
                value={searchValue}
                onChange={handleSearchChange}
                placeholder={searchType === 'cpf' ? '000.000.000-00' : 'seu@email.com'}
                maxLength={searchType === 'cpf' ? 14 : undefined}
                className="flex-1 px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#246c61] focus:border-[#246c61] text-lg"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    searchOrders()
                  }
                }}
              />
              <button
                onClick={searchOrders}
                disabled={
                  searchType === 'cpf'
                    ? searchValue.replace(/\D/g, '').length !== 11
                    : !searchValue.trim() || !searchValue.includes('@')
                }
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
              💡 {searchType === 'cpf' ? 'Digite o CPF usado no momento da compra' : 'Digite o email usado no momento da compra'}
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
                  Não encontramos pedidos com este {searchType === 'cpf' ? 'CPF' : 'email'}
                </p>
                <button
                  onClick={() => {
                    setSearchValue('')
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
                      setSearchValue('')
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

                <div className="grid gap-6">
                  {orders.map((order) => {
                    const statusInfo = getStatusInfo(order.status)
                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200 hover:shadow-xl transition-all cursor-pointer"
                        onClick={() => setSelectedOrder(order)}
                      >
                        {/* Header do Pedido */}
                        <div className="bg-gradient-to-r from-[#246c61] to-[#1d5850] text-white p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <p className="text-sm opacity-90 mb-1">Pedido</p>
                              <p className="text-2xl font-bold">{order.order_number}</p>
                            </div>
                            <div className="text-left md:text-right">
                              <p className="text-sm opacity-90 mb-1">Data do Pedido</p>
                              <p className="text-lg font-semibold">{formatDate(order.created_at)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Conteúdo do Pedido */}
                        <div className="p-6">
                          {/* Status */}
                          <div className="mb-4 flex items-center justify-between">
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold border-2 ${statusInfo.color}`}>
                              <span className="text-xl">{statusInfo.icon}</span>
                              {statusInfo.label}
                            </span>
                            <span className="text-3xl font-bold text-[#246c61]">
                              R$ {(order.total / 100).toFixed(2)}
                            </span>
                          </div>

                          {/* Preview dos Produtos */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex -space-x-2">
                              {order.items?.slice(0, 3).map((item, index) => (
                                item.product_image && (
                                  <img
                                    key={index}
                                    src={item.product_image}
                                    alt={item.product_name}
                                    className="w-12 h-12 rounded-full border-2 border-white object-cover"
                                  />
                                )
                              ))}
                            </div>
                            <p className="text-gray-600">
                              {order.items?.length} {order.items?.length === 1 ? 'produto' : 'produtos'}
                            </p>
                          </div>

                          {/* Tracking (se houver) */}
                          {order.tracking_code && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                <span className="text-sm font-semibold text-blue-900">
                                  Código: {order.tracking_code}
                                </span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  window.open(`/rastreio?codigo=${order.tracking_code}`, '_blank')
                                }}
                                className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                              >
                                Rastrear →
                              </button>
                            </div>
                          )}

                          {/* Call to action */}
                          <div className="mt-4 text-center">
                            <button className="text-[#246c61] hover:text-[#1d5850] font-semibold flex items-center gap-2 mx-auto">
                              Ver detalhes completos
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
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

      {/* Modal de Detalhes */}
      {selectedOrder && <OrderDetails order={selectedOrder} />}
    </div>
  )
}

export default MyOrdersNew
