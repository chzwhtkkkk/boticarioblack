import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { trackPurchase } from '../services/utmify'
import * as metaPixel from '../services/metaPixel'
import { products } from '../data/products'
import { formatPrice } from '../utils/formatPrice'

const OrderSuccess = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { addToCart } = useCart()
  const [order, setOrder] = useState(null)
  const [copied, setCopied] = useState(false)
  const [pixStatus, setPixStatus] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [showUpsell, setShowUpsell] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [upsellProcessing, setUpsellProcessing] = useState(false)
  const [upsellSuccess, setUpsellSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState(null)

  // Dados do Pix vindos da API Zuck Pay
  const pixData = location.state?.pixData || null
  const cardData = location.state?.cardData || null
  const paymentMethod = location.state?.paymentMethod || 'pix'
  const transactionId = location.state?.transactionId || pixData?.id || null

  // Countdown timer para expiração do PIX (10 minutos fixos)
  useEffect(() => {
    if (!pixData) return

    // Define expiração para 10 minutos a partir de agora
    const expirationTime = Date.now() + (10 * 60 * 1000) // 10 minutos em milissegundos

    const updateTimer = () => {
      const now = Date.now()
      const diff = expirationTime - now

      if (diff <= 0) {
        setTimeLeft({ minutes: 0, seconds: 0, expired: true })
        return
      }

      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setTimeLeft({ minutes, seconds, expired: false })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [pixData])

  // Produtos para downsell (produto GRÁTIS + frete - apenas produtos individuais, NÃO KITS)
  const getUpsellProduct = () => {
    const orderItems = location.state?.items || []
    const orderIds = orderItems.map(item => item.id)
    
    // Pega produtos individuais (NÃO KITS) que NÃO estão no pedido
    const availableProducts = products
      .filter(p => 
        p.category !== 'Kits e Presentes' && // NÃO é kit
        !orderIds.includes(p.id) && // NÃO está no pedido
        p.originalPrice > 0 && // Tem preço original
        p.bestSeller // Apenas best sellers
      )
      .sort((a, b) => b.originalPrice - a.originalPrice) // Ordena por preço (mais caro primeiro)
    
    // Retorna um produto aleatório dos 5 mais caros
    const topProducts = availableProducts.slice(0, 5)
    return topProducts[Math.floor(Math.random() * topProducts.length)] || null
  }

  const upsellProduct = getUpsellProduct()

  // Função para processar downsell - PRODUTO GRÁTIS + FRETE
  const handleUpsellClick = () => {
    if (!upsellProduct) {
      return
    }

    setUpsellProcessing(true)

    try {
      // Preço: apenas o frete de R$ 14,90
      const shippingPrice = 14.90
      
      // Cria produto com preço especial (apenas frete)
      const specialProduct = {
        ...upsellProduct,
        price: shippingPrice,
        originalPrice: upsellProduct.originalPrice,
        discount: 100, // 100% de desconto no produto
        isUpsell: true,
        isFreeProduct: true // Flag para identificar que é produto grátis
      }

      // Adiciona ao carrinho
      addToCart(specialProduct, 1)
      
      // Fecha modal de upsell
      setShowUpsell(false)
      setUpsellProcessing(false)
      
      // Mostra modal de sucesso
      setShowSuccess(true)
      
    } catch (error) {
      setUpsellProcessing(false)
      setShowUpsell(false)
    }
  }

  // Estado para loading do botão
  const [checkingStatus, setCheckingStatus] = useState(false)

  // Função para verificar status do PIX via API
  const checkPixStatusFromAPI = async () => {
    if (!pixData?.id && !location.state?.orderId) return
    
    setCheckingStatus(true)
    
    try {
      const pixId = pixData?.id
      const orderId = location.state?.orderId
      
      const response = await fetch(`/api/check-pix-status?pixId=${pixId}&orderId=${orderId}`)
      const data = await response.json()
      
      
      if (data.success && data.paid) {
        setPixStatus('paid')
        setLoading(false)
        
        // 🎯 DISPARA EVENTO PURCHASE quando PIX é PAGO (conversão real)
        const orderData = location.state
        if (orderData) {
          trackPurchase(
            orderData.orderId,
            orderData.items,
            orderData.total,
            {
              email: orderData.customerEmail,
              phone: orderData.customerPhone,
              name: orderData.customerName
            }
          )
          
          metaPixel.trackPurchase(
            orderData.orderId,
            orderData.items,
            orderData.total,
            {
              email: orderData.customerEmail,
              phone: orderData.customerPhone,
              name: orderData.customerName
            }
          )
        }
        
        // Mostra upsell após 3 segundos
        setTimeout(() => {
          if (upsellProduct && transactionId) {
            setShowUpsell(true)
          }
        }, 3000)
      } else {
      }
    } catch (error) {
    } finally {
      setCheckingStatus(false)
    }
  }

  // Função para verificar status do PIX via localStorage (atualizado pelo webhook)
  const checkPixStatusFromStorage = () => {
    if (!pixData?.id) return
    
    try {
      // Verifica se o webhook já atualizou o status no localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      const currentOrder = orders.find(o => o.pixId === pixData.id)
      
      if (currentOrder && currentOrder.status === 'paid') {
        setPixStatus('paid')
        setLoading(false)
        
        // 🎯 DISPARA EVENTO PURCHASE quando PIX é PAGO
        const orderData = location.state
        if (orderData) {
          trackPurchase(
            orderData.orderId,
            orderData.items,
            orderData.total,
            {
              email: orderData.customerEmail,
              phone: orderData.customerPhone,
              name: orderData.customerName
            }
          )
          
          metaPixel.trackPurchase(
            orderData.orderId,
            orderData.items,
            orderData.total,
            {
              email: orderData.customerEmail,
              phone: orderData.customerPhone,
              name: orderData.customerName
            }
          )
        }
        
        // Mostra upsell após 3 segundos
        setTimeout(() => {
          if (upsellProduct && transactionId) {
            setShowUpsell(true)
          }
        }, 3000)
        
        return true
      }
      
      return false
    } catch (error) {
      return false
    }
  }

  useEffect(() => {
    // Debug: ver o que está vindo da API
    
    // Verifica se tem dados do pedido
    if (!location.state) {
      navigate('/')
      return
    }

    // Se for PIX, verifica status periodicamente
    if (paymentMethod === 'pix' && pixData) {
      setOrder(location.state)
      setLoading(false)

      // Verifica status automaticamente a cada 5 segundos via API
      let checkCount = 0
      const maxChecks = 180 // 180 checks x 5 segundos = 15 minutos
      
      const statusInterval = setInterval(async () => {
        checkCount++
        
        try {
          const pixId = pixData?.id
          const orderId = location.state?.orderId
          
          const response = await fetch(`/api/check-pix-status?pixId=${pixId}&orderId=${orderId}`)
          const data = await response.json()
          
          if (data.success && data.paid) {
            clearInterval(statusInterval)
            
            setPixStatus('paid')
            setLoading(false)
            
            // 🎯 DISPARA EVENTO PURCHASE quando PIX é PAGO (conversão real)
            const orderData = location.state
            if (orderData) {
              trackPurchase(
                orderData.orderId,
                orderData.items,
                orderData.total,
                {
                  email: orderData.customerEmail,
                  phone: orderData.customerPhone,
                  name: orderData.customerName
                }
              )
              
              metaPixel.trackPurchase(
                orderData.orderId,
                orderData.items,
                orderData.total,
                {
                  email: orderData.customerEmail,
                  phone: orderData.customerPhone,
                  name: orderData.customerName
                }
              )
            }
            
            // Mostra upsell após 3 segundos
            setTimeout(() => {
              if (upsellProduct && transactionId) {
                setShowUpsell(true)
              }
            }, 3000)
          }
        } catch (error) {
        }
        
        // Para de verificar após 15 minutos (PIX expira)
        if (checkCount >= maxChecks) {
          clearInterval(statusInterval)
        }
      }, 5000) // Verifica a cada 5 segundos
      
      // Verifica imediatamente também
      checkPixStatusFromAPI()

      // Se for UPSELL REAL, não adiciona listener de teste
      if (location.state?.isUpsell) {
        return () => clearInterval(statusInterval)
      }

      // Listener para evento de teste (PIX pago) - APENAS PARA TESTES
      const handlePixPaid = (event) => {
        setPixStatus('paid')
        setLoading(false)
        clearInterval(statusInterval)
        
        // Mostra upsell após 3 segundos
        setTimeout(() => {
          if (upsellProduct && transactionId) {
            setShowUpsell(true)
          }
        }, 3000)
      }
      
      window.addEventListener('pixPaid', handlePixPaid)
      return () => {
        clearInterval(statusInterval)
        window.removeEventListener('pixPaid', handlePixPaid)
      }
    }

    // Se for cartão e já está pago, marca como pago imediatamente
    if (paymentMethod === 'card' && cardData?.isPaid) {
      setPixStatus('paid')
      
      // Mostra upsell após 3 segundos
      setTimeout(() => {
        if (upsellProduct && transactionId) {
          setShowUpsell(true)
        }
      }, 3000)
      
      return
    }
    
    // Se chegou até aqui sem dados, remove loading após 2 segundos
    const fallbackTimer = setTimeout(() => {
      setLoading(false)
    }, 2000)
    
    return () => clearTimeout(fallbackTimer)
  }, [location, navigate, pixData, cardData, paymentMethod])

  const handleCopyPix = () => {
    if (pixData?.pixCopyPaste) {
      navigator.clipboard.writeText(pixData.pixCopyPaste)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  if (!order && !location.state) return null

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <div className="inline-block bg-green-600 text-white rounded-full p-6 mb-4">
                <svg className="w-16 h-16 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gerando seu PIX...
              </h1>
              <p className="text-lg text-gray-600">
                Aguarde alguns segundos
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="animate-pulse">
                <div className="w-64 h-64 bg-gray-200 rounded-lg mx-auto mb-6"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-6 animate-fadeIn">
            <div className="inline-block bg-green-600 text-white rounded-full p-6 mb-4 animate-scaleIn shadow-lg">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {location.state?.isUpsell ? 'Oferta Especial Gerada!' : 'Pedido Realizado com Sucesso!'}
            </h1>
            <p className="text-lg text-gray-600">
              Pedido #{location.state?.orderId || order?.orderId}
            </p>
            {location.state?.isUpsell && (
              <div className="mt-4 bg-green-50 border-2 border-green-300 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-green-800 font-semibold">
                  Você ganhou 70% OFF neste produto!
                </p>
                <p className="text-green-700 text-sm mt-1">
                  Pague o PIX abaixo para garantir sua oferta especial
                </p>
              </div>
            )}
          </div>

          {/* Pix Payment Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-slideInUp">
            {pixStatus === 'paid' ? (
              <div className="text-center py-8">
                <div className="inline-block bg-green-600 text-white rounded-full p-6 mb-4 animate-bounce shadow-lg">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Pagamento Confirmado!
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  Obrigado pela sua compra, <strong>{location.state?.customerName}</strong>!
                </p>
                
                {/* Aviso de confirmação por email */}
                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mb-6 text-left">
                  <div className="flex items-start gap-3">
                    <svg className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div className="flex-1">
                      <p className="font-bold text-blue-900 mb-2 text-base">
                        Confirmação por Email
                      </p>
                      <p className="text-sm text-blue-700 leading-relaxed mb-3">
                        Em instantes você receberá um <strong>email de confirmação</strong> no endereço:
                      </p>
                      <div className="bg-white border border-blue-300 rounded-lg p-3 mb-3">
                        <p className="text-blue-900 font-semibold text-sm break-all">
                          {location.state?.customerEmail}
                        </p>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-3">
                        <p className="text-yellow-800 font-semibold text-xs">
                          Os pedidos são enviados apenas em <strong>horário comercial</strong> (Segunda a Sexta, 9h às 18h)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-6 text-left">
                  {/* Mensagem de entrega */}
                  <div className="flex items-start gap-3">
                    <svg className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                    <div className="text-left flex-1">
                      <p className="font-bold text-green-900 mb-3 text-base">
                        Envio e Rastreamento
                      </p>
                      <p className="text-sm text-green-700 leading-relaxed mb-4">
                        Você receberá o <strong>código de rastreio</strong> por email para acompanhar a entrega!
                      </p>
                      <div className="bg-white border border-green-300 rounded-lg p-4">
                        <p className="text-sm text-green-800 font-semibold mb-2">
                          Informações da entrega:
                        </p>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>Prazo: {location.state?.shippingDays || '5-10 dias úteis'}</li>
                          <li>Frete: {(location.state?.shipping || 0) === 0 ? 'Grátis' : `R$ ${(location.state?.shipping)?.toFixed(2)}`}</li>
                          <li>Pedido: <strong>#{location.state?.orderId}</strong></li>
                        </ul>
                      </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mensagem de agradecimento */}
                  <div className="mt-6 text-center">
                    <p className="text-gray-700 text-lg">
                      Qualquer dúvida, entre em contato conosco! 💚
                    </p>
                  </div>
              </div>
            ) : paymentMethod === 'pix' && pixData ? (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Pagamento via Pix
                  </h2>
                  <p className="text-gray-600">
                    Escaneie o QR Code ou copie o código Pix para finalizar o pagamento
                  </p>
                  {timeLeft && !timeLeft.expired && (
                    <div className="mt-3 bg-red-50 border-2 border-red-400 rounded-lg p-4 animate-pulse">
                      <p className="text-red-700 font-bold text-2xl flex items-center justify-center gap-2">
                        ⏰ {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                      </p>
                      <p className="text-red-600 font-semibold mt-2">⚠️ Pague agora! Expira em 10 minutos</p>
                    </div>
                  )}
                  {timeLeft?.expired && (
                    <div className="mt-3 bg-red-50 border-2 border-red-300 rounded-lg p-3">
                      <p className="text-red-700 font-bold">
                        ⚠️ PIX Expirado! Faça um novo pedido.
                      </p>
                    </div>
                  )}
                </div>

                {/* QR Code */}
                <div className="flex justify-center mb-6">
                  <div className="bg-white p-4 rounded-xl border-4 border-green-500 shadow-lg">
                    {(pixData.pix_code || pixData.qrcode) ? (
                      <img 
                        src={`https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(pixData.pix_code || pixData.qrcode)}`}
                        alt="QR Code Pix" 
                        className="w-64 h-64"
                        loading="eager"
                        onError={(e) => {
                          // Fallback para API alternativa
                          e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixData.pix_code || pixData.qrcode)}`
                        }}
                      />
                    ) : (
                      <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded">
                        <p className="text-gray-500 text-center px-4">
                          QR Code não disponível.<br/>
                          Use o código Pix abaixo.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div className="text-center mb-6">
                  <p className="text-gray-600 mb-2">Valor a pagar:</p>
                  <p className="text-4xl font-bold text-green-600">
                    R$ {location.state?.total?.toFixed(2) || order?.total?.toFixed(2)}
                  </p>
                </div>

                {/* Pix Code */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Código Pix Copia e Cola:</p>
                  <div className="bg-white border-2 border-gray-300 rounded-lg p-3 break-all text-sm font-mono text-gray-700 max-h-32 overflow-y-auto">
                    {pixData.pix_code || pixData.qrcode}
                  </div>
                </div>

                {/* Copy Button */}
                <button
                  onClick={handleCopyPix}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg ${
                    copied 
                      ? 'bg-[#246c61] text-white' 
                      : 'bg-gradient-to-r from-[#246c61] to-[#1d5850] text-white hover:from-[#1d5850] hover:to-[#246c61]'
                  }`}
                >
                  {copied ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Código Copiado!
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copiar Código Pix
                    </span>
                  )}
                </button>

                {/* Verificação automática em background - sem UI */}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="inline-block bg-gray-200 text-gray-600 rounded-full p-6 mb-4">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Processando Pagamento...
                </h2>
                <p className="text-gray-600">
                  Aguarde enquanto confirmamos seu pagamento.
                </p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-[#246c61] mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Como pagar com Pix:
            </h3>
            <ol className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#246c61] text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span>Abra o app do seu banco</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#246c61] text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span>Escolha pagar com Pix QR Code ou Pix Copia e Cola</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#246c61] text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span>Escaneie o QR Code ou cole o código acima</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#246c61] text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                <span>Confirme o pagamento de R$ {(location.state?.total || order?.total)?.toFixed(2)}</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#246c61] text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
                <span>Pronto! Seu pedido será processado automaticamente</span>
              </li>
            </ol>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-gray-200">
            <h3 className="text-xl font-bold text-[#246c61] mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Detalhes do Pedido
            </h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>Pedido:</span>
                <span className="font-semibold">#{location.state?.orderId || order?.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span>Nome:</span>
                <span className="font-semibold">{location.state?.customerName || order?.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="font-semibold">{location.state?.customerEmail || order?.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span>Telefone:</span>
                <span className="font-semibold">{location.state?.customerPhone || order?.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span>Forma de Pagamento:</span>
                <span className="font-semibold">
                  {paymentMethod === 'pix' ? '💳 PIX' : '💳 Cartão de Crédito'}
                </span>
              </div>
              {paymentMethod === 'card' && location.state?.installments > 1 && (
                <div className="flex justify-between">
                  <span>Parcelamento:</span>
                  <span className="font-semibold">{location.state.installments}x</span>
                </div>
              )}
              {(location.state?.discount || order?.discount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Desconto:</span>
                  <span className="font-semibold">- R$ {(location.state?.discount || order?.discount)?.toFixed(2)}</span>
                </div>
              )}
              {(location.state?.shipping !== undefined || order?.shipping !== undefined) && (
                <div className="flex justify-between">
                  <span>Frete ({location.state?.shippingOption || order?.shippingOption}):</span>
                  <span className={`font-semibold ${(location.state?.shipping || order?.shipping) === 0 ? 'text-green-600' : ''}`}>
                    {(location.state?.shipping || order?.shipping) === 0 ? 'Grátis 🚚' : `R$ ${(location.state?.shipping || order?.shipping)?.toFixed(2)}`}
                  </span>
                </div>
              )}
              <div className="border-t-2 border-gray-200 pt-3 flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-[#246c61]">R$ {(location.state?.total || order?.total)?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900 font-medium transition"
            >
              ← Voltar para a Loja
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp Button Customizado para Página de Pagamento */}
      {pixStatus !== 'paid' && (
        <a
          href={`https://wa.me/5511951947983?text=${encodeURIComponent(
            `Olá! Estou na página de pagamento do pedido #${location.state?.orderId || order?.orderId}. Preciso de ajuda com o PIX.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 group"
          aria-label="Ajuda com pagamento PIX"
        >
          <div className="flex items-center gap-3 px-4 py-4">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="whitespace-nowrap font-semibold">
              Ajuda com PIX
            </span>
          </div>
        </a>
      )}

      {/* MODAL DE DOWNSELL - PRODUTO GRÁTIS + FRETE */}
      {showUpsell && upsellProduct && !upsellSuccess && pixStatus === 'paid' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl transform animate-scaleIn relative overflow-hidden">
            {/* Header chamativo */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center py-4 px-4">
              <p className="font-bold text-xl mb-1">🎉 PARABÉNS!</p>
              <p className="font-semibold text-base">Você GANHOU este produto!</p>
            </div>

            {/* Botão fechar */}
            <button
              onClick={() => setShowUpsell(false)}
              className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-100 transition z-10"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-5">
              <div className="text-center mb-4">
                <div className="inline-block bg-red-100 text-red-800 px-4 py-2 rounded-full font-bold text-sm border-2 border-red-300 mb-3">
                  🔥 PRODUTO 100% GRÁTIS
                </div>
                <p className="text-gray-700 text-base font-semibold">
                  Pague apenas o frete de <span className="text-green-600 text-xl">R$ 14,90</span>
                </p>
              </div>

              {/* Card do produto */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-green-300">
                <div className="relative">
                  <img
                    src={upsellProduct.image}
                    alt={upsellProduct.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1.5 rounded-full font-bold text-sm shadow-lg animate-pulse">
                    GRÁTIS
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 text-base line-clamp-2">
                    {upsellProduct.name}
                  </h3>
                  
                  <div className="flex items-center gap-1 text-yellow-500 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                    <span className="text-gray-600 text-xs ml-1">({upsellProduct.reviews})</span>
                  </div>

                  <div className="mb-3 bg-green-50 border-2 border-green-300 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Valor do produto:</span>
                      <span className="text-lg font-bold text-gray-400 line-through">
                        R$ {formatPrice(upsellProduct.originalPrice)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Seu desconto:</span>
                      <span className="text-lg font-bold text-green-600">
                        - R$ {formatPrice(upsellProduct.originalPrice)}
                      </span>
                    </div>
                    <div className="border-t-2 border-green-300 pt-2 flex items-center justify-between">
                      <span className="text-base font-bold text-gray-900">Você paga apenas:</span>
                      <span className="text-2xl font-bold text-green-600">
                        R$ 14,90
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 text-center">
                      💚 Economia de R$ {formatPrice(upsellProduct.originalPrice)}
                    </p>
                  </div>

                  {/* Benefícios */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span><strong>Produto 100% GRÁTIS</strong> - Pague só o envio</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Enviado junto com seu pedido</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Pagamento rápido via <strong>PIX</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={handleUpsellClick}
                    disabled={upsellProcessing}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-lg text-sm transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-2"
                  >
                    {upsellProcessing ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adicionando...
                      </span>
                    ) : (
                      `🎁 SIM! QUERO MEU PRESENTE - R$ 14,90`
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => setShowUpsell(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg text-sm transition-all"
                >
                  Não, obrigado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* MODAL DE SUCESSO - PRODUTO GRÁTIS ADICIONADO */}
      {showSuccess && upsellProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform animate-scaleIn relative overflow-hidden">
            {/* Header verde */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center py-6 px-4">
              <div className="inline-block bg-white rounded-full p-4 mb-3">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold">Presente Garantido! 🎉</h2>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-gray-700 text-lg mb-2">
                  <strong>{upsellProduct.name}</strong>
                </p>
                <p className="text-gray-600 mb-4">
                  foi adicionado ao seu carrinho <strong className="text-green-600">100% GRÁTIS</strong>!
                </p>
                
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-1">Você paga apenas o frete:</p>
                  <p className="text-3xl font-bold text-green-600">
                    R$ 14,90
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Economia de R$ {formatPrice(upsellProduct.originalPrice)}
                  </p>
                </div>

                <p className="text-sm text-gray-600">
                  Finalize a compra no carrinho para garantir seu presente!
                </p>
              </div>

              <button
                onClick={() => {
                  setShowSuccess(false)
                  navigate('/carrinho')
                }}
                className="w-full bg-[#246c61] hover:bg-[#1d5850] text-white font-bold py-4 px-6 rounded-lg text-lg transition-all shadow-md"
              >
                🛒 Ir para o Carrinho
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderSuccess
