import { useState, useEffect } from 'react'
import { formatPrice } from '../utils/formatPrice'

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Senha do admin (você pode mudar depois)
  const ADMIN_PASSWORD = 'admin123'

  useEffect(() => {
    // Verifica se já está autenticado
    const auth = sessionStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
      loadOrders()
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      filterOrders()
    }
  }, [orders, statusFilter, searchTerm])

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem('adminAuth', 'true')
      loadOrders()
    } else {
      alert('Senha incorreta!')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('adminAuth')
    setPassword('')
  }

  const loadOrders = () => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    // Ordena por data (mais recente primeiro)
    allOrders.sort((a, b) => new Date(b.date) - new Date(a.date))
    setOrders(allOrders)
  }

  const filterOrders = () => {
    let filtered = [...orders]

    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Filtro por busca (ID, nome, email, CPF)
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(order => 
        order.id?.toLowerCase().includes(term) ||
        order.customer?.name?.toLowerCase().includes(term) ||
        order.customer?.email?.toLowerCase().includes(term) ||
        order.customer?.cpf?.includes(term)
      )
    }

    setFilteredOrders(filtered)
  }

  const updateOrderStatus = (orderId, newStatus) => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    const updatedOrders = allOrders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus }
      }
      return order
    })
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
    loadOrders()
    alert('Status atualizado com sucesso!')
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

  const getStatusCount = (status) => {
    if (status === 'all') return orders.length
    return orders.filter(order => order.status === status).length
  }

  // Tela de Login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-[#246c61]">
            <div className="text-center mb-8">
              <div className="inline-block bg-[#246c61] text-white rounded-full p-4 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-[#246c61] mb-2">Painel Admin</h1>
              <p className="text-gray-600">Gerenciamento de Pedidos</p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Senha de Acesso</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#246c61] focus:border-[#246c61]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#246c61] to-[#1d5850] hover:from-[#1d5850] hover:to-[#246c61] text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Entrar
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-6">
              🔒 Acesso restrito apenas para administradores
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Painel Admin
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#246c61] mb-2">Painel Admin</h1>
            <p className="text-gray-600">Gerenciamento de Pedidos</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <button
            onClick={() => setStatusFilter('all')}
            className={`p-4 rounded-xl border-2 transition-all ${
              statusFilter === 'all' 
                ? 'bg-[#246c61] text-white border-[#246c61]' 
                : 'bg-white border-gray-200 hover:border-[#246c61]'
            }`}
          >
            <p className="text-2xl font-bold">{getStatusCount('all')}</p>
            <p className="text-sm">Todos</p>
          </button>

          <button
            onClick={() => setStatusFilter('pending')}
            className={`p-4 rounded-xl border-2 transition-all ${
              statusFilter === 'pending' 
                ? 'bg-yellow-500 text-white border-yellow-500' 
                : 'bg-white border-gray-200 hover:border-yellow-500'
            }`}
          >
            <p className="text-2xl font-bold">{getStatusCount('pending')}</p>
            <p className="text-sm">Pendentes</p>
          </button>

          <button
            onClick={() => setStatusFilter('paid')}
            className={`p-4 rounded-xl border-2 transition-all ${
              statusFilter === 'paid' 
                ? 'bg-green-500 text-white border-green-500' 
                : 'bg-white border-gray-200 hover:border-green-500'
            }`}
          >
            <p className="text-2xl font-bold">{getStatusCount('paid')}</p>
            <p className="text-sm">Pagos</p>
          </button>

          <button
            onClick={() => setStatusFilter('processing')}
            className={`p-4 rounded-xl border-2 transition-all ${
              statusFilter === 'processing' 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'bg-white border-gray-200 hover:border-blue-500'
            }`}
          >
            <p className="text-2xl font-bold">{getStatusCount('processing')}</p>
            <p className="text-sm">Processando</p>
          </button>

          <button
            onClick={() => setStatusFilter('shipped')}
            className={`p-4 rounded-xl border-2 transition-all ${
              statusFilter === 'shipped' 
                ? 'bg-purple-500 text-white border-purple-500' 
                : 'bg-white border-gray-200 hover:border-purple-500'
            }`}
          >
            <p className="text-2xl font-bold">{getStatusCount('shipped')}</p>
            <p className="text-sm">Enviados</p>
          </button>

          <button
            onClick={() => setStatusFilter('delivered')}
            className={`p-4 rounded-xl border-2 transition-all ${
              statusFilter === 'delivered' 
                ? 'bg-green-600 text-white border-green-600' 
                : 'bg-white border-gray-200 hover:border-green-600'
            }`}
          >
            <p className="text-2xl font-bold">{getStatusCount('delivered')}</p>
            <p className="text-sm">Entregues</p>
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border-2 border-gray-200">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por ID, nome, email ou CPF..."
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246c61] focus:border-[#246c61]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center border-2 border-gray-200">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum pedido encontrado</h3>
              <p className="text-gray-600">
                {statusFilter !== 'all' 
                  ? `Não há pedidos com status "${getStatusInfo(statusFilter).label}"`
                  : 'Ainda não há pedidos no sistema'
                }
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status)
              return (
                <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-gray-200 hover:shadow-xl transition-shadow">
                  {/* Header do Pedido */}
                  <div className="bg-gradient-to-r from-[#246c61] to-[#1d5850] text-white p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <p className="text-sm opacity-90">Pedido</p>
                        {/* Garante que sempre mostra o ID correto, mesmo se vier com prefixo errado */}
                        <p className="text-xl font-bold">
                          #{order.id?.startsWith('ORD-') ? order.id : `ORD-${order.id}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-left md:text-right">
                          <p className="text-sm opacity-90">Data</p>
                          <p className="font-semibold">{formatDate(order.date)}</p>
                        </div>
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold border-2 ${statusInfo.color}`}>
                          <span className="text-lg">{statusInfo.icon}</span>
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo do Pedido */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Cliente */}
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-[#246c61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Cliente
                        </h4>
                        <div className="space-y-2 text-sm text-gray-700">
                          <p><strong>Nome:</strong> {order.customer?.name}</p>
                          <p><strong>Email:</strong> {order.customer?.email}</p>
                          <p><strong>Telefone:</strong> {order.customer?.phone}</p>
                          <p><strong>CPF:</strong> {order.customer?.cpf}</p>
                        </div>
                      </div>

                      {/* Endereço */}
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-[#246c61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          Endereço
                        </h4>
                        <div className="text-sm text-gray-700">
                          <p>{order.customer?.address}, {order.customer?.number}</p>
                          {order.customer?.complement && <p>{order.customer?.complement}</p>}
                          <p>{order.customer?.neighborhood}</p>
                          <p>{order.customer?.city}/{order.customer?.state}</p>
                          <p>CEP: {order.customer?.cep}</p>
                        </div>
                      </div>
                    </div>

                    {/* Produtos */}
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#246c61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Produtos ({order.items?.length || 0})
                      </h4>
                      <div className="space-y-2">
                        {order.items?.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded border-2 border-[#246c61]"
                            />
                            <div className="flex-1">
                              {/* Garante que sempre mostra o nome do produto, mesmo se for upsell */}
                              <p className="font-semibold text-sm text-gray-900">
                                {item.name}
                                {item.isUpsell && item.isFreeProduct && (
                                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                    🎁 GRÁTIS
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-gray-600">Qtd: {item.quantity}</p>
                            </div>
                            <p className="font-bold text-[#246c61]">
                              R$ {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Valores */}
                    <div className="border-t-2 border-gray-200 pt-4 mb-6">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-700">
                          <span>Subtotal:</span>
                          <span className="font-semibold">R$ {formatPrice(order.subtotal || 0)}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Desconto:</span>
                            <span className="font-semibold">- R$ {formatPrice(order.discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-gray-700">
                          <span>Frete:</span>
                          <span className="font-semibold">
                            {order.shipping === 0 ? 'Grátis' : `R$ ${formatPrice(order.shipping)}`}
                          </span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t-2 border-gray-200">
                          <span>Total:</span>
                          <span className="text-[#246c61]">R$ {formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex-1 bg-[#246c61] hover:bg-[#1d5850] text-white font-semibold px-4 py-2 rounded-lg transition"
                      >
                        Alterar Status
                      </button>
                      <button
                        onClick={() => {
                          const whatsappMessage = `Olá ${order.customer?.name}! Seu pedido #${order.id} está com status: ${statusInfo.label}`
                          window.open(`https://wa.me/55${order.customer?.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`, '_blank')
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition"
                      >
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Modal de Alterar Status */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="bg-gradient-to-r from-[#246c61] to-[#1d5850] text-white p-6 rounded-t-2xl">
              <h3 className="text-2xl font-bold">Alterar Status</h3>
              <p className="text-sm opacity-90 mt-1">Pedido #{selectedOrder.id}</p>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                <strong>Cliente:</strong> {selectedOrder.customer?.name}
              </p>

              <div className="space-y-2 mb-6">
                {['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => {
                  const info = getStatusInfo(status)
                  return (
                    <button
                      key={status}
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, status)
                        setSelectedOrder(null)
                      }}
                      className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                        selectedOrder.status === status
                          ? info.color + ' border-current'
                          : 'bg-gray-50 border-gray-200 hover:border-[#246c61]'
                      }`}
                    >
                      <span className="text-2xl">{info.icon}</span>
                      <span className="font-semibold">{info.label}</span>
                      {selectedOrder.status === status && (
                        <span className="ml-auto text-sm">(Atual)</span>
                      )}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
