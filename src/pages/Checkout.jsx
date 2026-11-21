import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { trackInitiateCheckout, trackPurchase, getUTMs, getSubids } from '../utils/tracking'
import { formatPrice } from '../utils/formatPrice'
import PromoCountdown from '../components/PromoCountdown'
import SocialProofNotification from '../components/SocialProofNotification'

const Checkout = () => {
  const navigate = useNavigate()
  const { cart, getCartSubtotal, getDiscount, getCartTotal, clearCart } = useCart()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    cep: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  })

  const [loadingCep, setLoadingCep] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [shippingOption, setShippingOption] = useState('retirada') // retirada, gratis, expresso
  const [expressPrice] = useState((Math.random() * 8 + 1).toFixed(2)) // Preço aleatório entre 1.00 e 9.99
  const [pixData, setPixData] = useState(null) // Dados do PIX gerado
  const [showPixModal, setShowPixModal] = useState(false) // Modal do QR Code
  const [pollingInterval, setPollingInterval] = useState(null) // Intervalo do polling

  // Track InitiateCheckout quando entrar na página
  useEffect(() => {
    if (cart.length > 0) {
      trackInitiateCheckout(cart, getCartTotal())
    }
    
    // Cleanup: parar polling quando sair da página
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [])

  // Função para iniciar polling de verificação de pagamento
  const startPaymentPolling = (paymentId) => {
    console.log('🔄 Iniciando polling para pagamento:', paymentId)
    
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/avenpay/check-status?payment_id=${paymentId}`)
        const data = await response.json()
        
        console.log('📊 Status:', data.status)
        
        if (data.status === 'PAID') {
          // Pagamento aprovado!
          clearInterval(interval)
          setPollingInterval(null)
          
          console.log('🎉 Pagamento aprovado! Redirecionando...')
          
          // Disparar evento de conversão
          trackPurchase({
            orderId: pixData.external_ref,
            items: cart,
            total: getTotalWithShipping()
          })
          
          // Limpar carrinho
          clearCart()
          
          // Capturar UTMs da URL atual
          const urlParams = new URLSearchParams(window.location.search)
          const utmParams = new URLSearchParams()
          for (const [key, value] of urlParams) {
            if (key.startsWith('utm_') || key === 'src' || key === 'sck') {
              utmParams.append(key, value)
            }
          }
          
          // Redirecionar para página de sucesso com UTMs
          navigate(`/sucesso?order_id=${data.payment_id}&${utmParams.toString()}`)
        }
      } catch (error) {
        console.error('❌ Erro no polling:', error)
      }
    }, 3000) // Verificar a cada 3 segundos
    
    setPollingInterval(interval)
  }

  // Função para copiar código PIX
  const copyPixCode = () => {
    if (pixData?.qr_code) {
      navigator.clipboard.writeText(pixData.qr_code)
      alert('Código PIX copiado!')
    }
  }

  if (cart.length === 0) {
    navigate('/produtos')
    return null
  }

  // Calcula o valor do frete baseado na opção selecionada
  const getShippingPrice = () => {
    if (shippingOption === 'expresso') {
      return parseFloat(expressPrice)
    }
    return 0
  }

  // Calcula total com frete
  const getTotalWithShipping = () => {
    return getCartTotal() + getShippingPrice()
  }

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
  }

  const formatCep = (value) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{5})(\d{0,3})/, '$1-$2')
  }

  const formatCpf = (value) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4')
  }

  const handleCepBlur = async () => {
    const cep = formData.cep.replace(/\D/g, '')
    
    if (cep.length === 8) {
      setLoadingCep(true)
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const data = await response.json()
        
        if (!data.erro) {
          setFormData({
            ...formData,
            address: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || ''
          })
        } else {
          alert('CEP não encontrado')
        }
      } catch (error) {
        alert('Erro ao buscar CEP. Tente novamente.')
      } finally {
        setLoadingCep(false)
      }
    }
  }

  const handleChange = (e) => {
    let { name, value } = e.target

    if (name === 'phone') {
      value = formatPhone(value)
    } else if (name === 'cep') {
      value = formatCep(value)
    } else if (name === 'cpf') {
      value = formatCpf(value)
    } else if (name === 'state') {
      value = value.toUpperCase().slice(0, 2)
    }

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault()
    }
    
    if (!formData.name || formData.name.trim().length < 3) {
      alert('Por favor, preencha seu nome completo.')
      return
    }
    
    if (!formData.email || !formData.email.includes('@')) {
      alert('Por favor, preencha um email válido.')
      return
    }
    
    if (!formData.phone || formData.phone.replace(/\D/g, '').length < 10) {
      alert('Por favor, preencha um telefone válido com DDD.')
      return
    }
    
    if (!formData.cpf || formData.cpf.replace(/\D/g, '').length !== 11) {
      alert('Por favor, preencha um CPF válido.')
      return
    }
    
    if (!formData.cep || formData.cep.replace(/\D/g, '').length !== 8) {
      alert('Por favor, preencha um CEP válido.')
      return
    }
    
    if (!formData.address || !formData.number || !formData.neighborhood || !formData.city || !formData.state) {
      alert('Por favor, preencha todos os campos de endereço.')
      return
    }

    setIsProcessing(true)

    try {
      const shippingPrice = getShippingPrice()
      const total = getTotalWithShipping()
      
      // Capturar UTMs
      const utms = getUTMs()
      const subids = getSubids()

      // Preparar dados para Avenpay
      const paymentData = {
        customer: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.replace(/\D/g, ''),
          document: formData.cpf.replace(/\D/g, '')
        },
        cart: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: total,
        address: {
          street: formData.address.trim(),
          number: formData.number.trim(),
          complement: formData.complement.trim(),
          neighborhood: formData.neighborhood.trim(),
          city: formData.city.trim(),
          state: formData.state.trim().toUpperCase(),
          cep: formData.cep.replace(/\D/g, '')
        },
        tracking: utms || {}
      }

      console.log('📤 Criando pagamento Avenpay...', paymentData)

      // Chamar API para criar PIX
      const response = await fetch('/api/avenpay/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      })

      const paymentResponse = await response.json()
        
      if (!paymentResponse.success) {
        throw new Error(paymentResponse.error || 'Erro ao gerar pagamento')
      }

      console.log('✅ PIX gerado com sucesso:', paymentResponse)

      // Salvar dados do PIX
      setPixData(paymentResponse)
      setShowPixModal(true)

      // Iniciar polling para verificar pagamento
      startPaymentPolling(paymentResponse.payment_id)

    } catch (error) {
      alert('Erro ao processar pedido: ' + error.message)
      setIsProcessing(false)
    }
  }

  return (
    <>
      {/* Banner Countdown */}
      <PromoCountdown />
      
      {/* Notificações Popup */}
      <SocialProofNotification />
      
      <div className="min-h-screen bg-gray-50 pb-12">
        {/* Banner Promocional Checkout */}
        <div className="bg-white shadow-sm mb-4">
          <div className="container mx-auto px-4 py-3">
            <img 
              src="/images/banner-checkout-certo.png"
              alt="Promoção Dia dos Namorados"
              className="w-full max-w-4xl mx-auto rounded-lg shadow-md"
            />
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            
            {/* Selos de Confiança */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white rounded-lg p-3 shadow-sm border-2 border-green-200 flex flex-col items-center text-center">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-[11px] md:text-xs font-bold text-gray-900">DADOS<br/>PROTEGIDOS</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm border-2 border-green-200 flex flex-col items-center text-center">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                <p className="text-[11px] md:text-xs font-bold text-gray-900">ENTREGA<br/>GARANTIDA</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm border-2 border-green-200 flex flex-col items-center text-center">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[11px] md:text-xs font-bold text-gray-900">RETIRADA<br/>EM 24H</p>
              </div>
            </div>

            {/* Resumo do Pedido */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-5 mb-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Resumo do Pedido</h2>
              <div className="space-y-3 mb-4 pb-4 border-b">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded border-2 border-gray-200"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm md:text-base text-gray-900 line-clamp-2">{item.name}</p>
                      <p className="text-xs md:text-sm text-gray-500">Quantidade: {item.quantity}</p>
                    </div>
                    <p className="text-base md:text-lg font-bold text-green-600">R$ {formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-xl md:text-2xl font-bold">
                <span>Total</span>
                <span className="text-green-600">R$ {formatPrice(getCartTotal())}</span>
              </div>
            </div>

            {/* Opções de Entrega */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-5 mb-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Escolha a Entrega</h2>
              <div className="space-y-3">
                
                {/* Retirada na Loja */}
                <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  shippingOption === 'retirada' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                }`}>
                  <input
                    type="radio"
                    name="shipping"
                    value="retirada"
                    checked={shippingOption === 'retirada'}
                    onChange={(e) => setShippingOption(e.target.value)}
                    className="w-5 h-5 text-green-600"
                  />
                  <img 
                    src="/images/logo chekout/obooticario.png"
                    alt="O Boticário"
                    className="w-12 h-12 object-contain"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">Retirada na Loja</p>
                    <p className="text-sm text-gray-600">Disponível em até 24h</p>
                  </div>
                  <p className="font-bold text-green-600 text-lg">GRÁTIS</p>
                </label>

                {/* Frete Grátis */}
                <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  shippingOption === 'gratis' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                }`}>
                  <input
                    type="radio"
                    name="shipping"
                    value="gratis"
                    checked={shippingOption === 'gratis'}
                    onChange={(e) => setShippingOption(e.target.value)}
                    className="w-5 h-5 text-green-600"
                  />
                  <img 
                    src="/images/logo chekout/correios.png"
                    alt="Correios"
                    className="w-12 h-12 object-contain"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">Frete Grátis</p>
                    <p className="text-sm text-gray-600">Entrega em 3-6 dias úteis</p>
                  </div>
                  <p className="font-bold text-green-600 text-lg">GRÁTIS</p>
                </label>

                {/* Frete Expresso */}
                <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  shippingOption === 'expresso' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                }`}>
                  <input
                    type="radio"
                    name="shipping"
                    value="expresso"
                    checked={shippingOption === 'expresso'}
                    onChange={(e) => setShippingOption(e.target.value)}
                    className="w-5 h-5 text-green-600"
                  />
                  <img 
                    src="/images/logo chekout/jadlog.png"
                    alt="Jadlog"
                    className="w-12 h-12 object-contain"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">Frete Expresso</p>
                    <p className="text-sm text-gray-600">Entrega em 1-3 dias úteis</p>
                  </div>
                  <p className="font-bold text-orange-600 text-lg">R$ {expressPrice}</p>
                </label>
              </div>

              {/* Total com Frete */}
              <div className="mt-4 pt-4 border-t-2 border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-semibold text-gray-900">R$ {formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-700">Frete</span>
                  <span className="font-semibold text-gray-900">
                    {getShippingPrice() === 0 ? 'GRÁTIS' : `R$ ${formatPrice(getShippingPrice())}`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xl md:text-2xl font-bold">
                  <span>Total</span>
                  <span className="text-green-600">R$ {formatPrice(getTotalWithShipping())}</span>
                </div>
              </div>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-5 md:p-6 space-y-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Seus dados</h2>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nome completo *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
                  placeholder="João da Silva"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
                  placeholder="seuemail@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone (WhatsApp) *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CPF *</label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                  placeholder="000.000.000-00"
                  maxLength="14"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CEP *</label>
                <input
                  type="text"
                  name="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  onBlur={handleCepBlur}
                  required
                  placeholder="00000-000"
                  maxLength="9"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
                />
                {loadingCep && (
                  <p className="text-sm text-blue-600 mt-1 font-medium">Buscando endereço...</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Endereço *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
                    placeholder="Rua..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Número *</label>
                  <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
                    placeholder="123"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Complemento</label>
                <input
                  type="text"
                  name="complement"
                  value={formData.complement}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
                  placeholder="Apto, Bloco..."
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bairro *</label>
                  <input
                    type="text"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cidade *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">UF *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    maxLength="2"
                    placeholder="SP"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base uppercase"
                  />
                </div>
              </div>

              {/* Depoimento */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                      M
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm md:text-base text-gray-800 italic font-medium leading-relaxed">
                      "Adorei! Produto original, entrega rápida e embalagem perfeita. Super recomendo! 💚"
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 mt-2 font-semibold">Maria Silva - São Paulo, SP</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-lg text-lg md:text-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>FINALIZAR PEDIDO COM SEGURANÇA</span>
                  </>
                )}
              </button>

              <p className="text-xs md:text-sm text-center text-gray-500 mt-3 flex items-center justify-center gap-1">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Seus dados estão protegidos e criptografados
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Modal do QR Code PIX */}
      {showPixModal && pixData && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pedido Criado!</h2>
              <p className="text-gray-600">Escaneie o QR Code para pagar</p>
            </div>

            {/* QR Code */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-4 flex justify-center">
              {pixData.qr_code ? (
                <div className="w-64 h-64 flex flex-col items-center justify-center">
                  <svg className="w-24 h-24 text-green-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <p className="text-sm text-gray-600 text-center">
                    Abra o app do seu banco e escaneie o código Pix Copia e Cola abaixo
                  </p>
                </div>
              ) : (
                <div className="w-64 h-64 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">QR Code indisponível</p>
                </div>
              )}
            </div>

            {/* Código Copia e Cola */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Código Pix Copia e Cola:
              </label>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 break-all text-xs font-mono">
                {pixData.qr_code}
              </div>
              <button
                onClick={copyPixCode}
                className="w-full mt-2 bg-[#246c61] hover:bg-[#1d5850] text-white font-medium py-2 rounded-lg transition-colors"
              >
                Copiar Código PIX
              </button>
            </div>

            {/* Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-sm font-medium text-blue-900">
                  Aguardando pagamento...
                </span>
              </div>
              <p className="text-xs text-blue-700 mt-2">
                Assim que confirmarmos o pagamento, você será redirecionado automaticamente.
              </p>
            </div>

            {/* Info */}
            <div className="text-xs text-gray-500 text-center">
              <p>Pedido: {pixData.external_ref}</p>
              <p>Valor: R$ {(pixData.amount / 100).toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Checkout
