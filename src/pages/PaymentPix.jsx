import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { formatPrice } from '../utils/formatPrice'

const PaymentPix = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { pixData, cart, formData, shippingOption } = location.state || {}

  const [timeLeft, setTimeLeft] = useState(300) // 5 minutos em segundos
  const [pixCopied, setPixCopied] = useState(false)
  const [pollingInterval, setPollingInterval] = useState(null)

  // Redirecionar se não houver dados
  useEffect(() => {
    if (!pixData || !cart || !formData) {
      navigate('/checkout')
    }
  }, [pixData, cart, formData, navigate])

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Polling de verificação de pagamento
  useEffect(() => {
    if (!pixData?.payment_id) return

    const checkPayment = async () => {
      try {
        const response = await fetch(`/api/avenpay/check-status?payment_id=${pixData.payment_id}`)
        if (!response.ok) return

        const data = await response.json()
        
        if (data.status === 'PAID') {
          // Parar polling
          if (pollingInterval) {
            clearInterval(pollingInterval)
          }
          
          // Salvar pedido
          await fetch('/api/avenpay/save-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              payment_id: data.payment_id,
              customer: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                document: formData.cpf
              },
              cart: cart,
              address: {
                street: formData.address,
                number: formData.number,
                complement: formData.complement,
                neighborhood: formData.neighborhood,
                city: formData.city,
                state: formData.state,
                cep: formData.cep
              }
            })
          })
          
          // Capturar UTMs da URL
          const urlParams = new URLSearchParams(window.location.search)
          const utmParams = new URLSearchParams()
          for (const [key, value] of urlParams) {
            if (key.startsWith('utm_') || key === 'src' || key === 'sck') {
              utmParams.append(key, value)
            }
          }
          
          // Redirecionar para sucesso
          navigate(`/sucesso?order_id=${data.payment_id}&${utmParams.toString()}`)
        }
      } catch (error) {
        console.error('Erro ao verificar pagamento:', error)
      }
    }

    // Verificar imediatamente
    checkPayment()
    
    // Depois verificar a cada 3 segundos
    const interval = setInterval(checkPayment, 3000)
    setPollingInterval(interval)

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [pixData, formData, cart, navigate])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const copyPixCode = () => {
    if (pixData?.qr_code) {
      navigator.clipboard.writeText(pixData.qr_code)
      setPixCopied(true)
      setTimeout(() => setPixCopied(false), 3000)
    }
  }

  const getShippingLabel = () => {
    if (shippingOption === 'retirada') return 'Retirada na Loja'
    if (shippingOption === 'gratis') return 'Frete Grátis (3-6 dias)'
    return 'Frete Expresso (1-3 dias)'
  }

  if (!pixData || !cart || !formData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pb-20">
      <div className="container mx-auto px-3 py-4 md:px-4 md:py-8">
        <div className="max-w-2xl mx-auto">
          
          {/* Header com Timer */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-2xl p-4 md:p-6 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h1 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">⏰ Finalize seu Pagamento!</h1>
                <p className="text-orange-100 text-sm md:text-base">Sua promoção expira em:</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3 md:px-6 md:py-4 border-2 border-white/30">
                <div className="text-3xl md:text-5xl font-bold text-center tabular-nums">
                  {formatTime(timeLeft)}
                </div>
                <p className="text-xs md:text-sm text-orange-100 text-center mt-1">minutos</p>
              </div>
            </div>
            {timeLeft <= 60 && (
              <div className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg text-center font-semibold animate-pulse text-sm md:text-base">
                ⚠️ ÚLTIMO MINUTO! Pague agora ou perderá a promoção!
              </div>
            )}
          </div>

          <div className="bg-white rounded-b-2xl shadow-xl p-4 md:p-6 space-y-4 md:space-y-6">
            
            {/* Resumo do Pedido */}
            <div className="border-2 border-green-100 rounded-xl p-3 md:p-5 bg-green-50/50">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Seu Pedido
              </h2>
              
              {/* Produtos */}
              <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-2 md:gap-3 items-center bg-white rounded-lg p-2 md:p-3 border border-green-200">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-14 h-14 md:w-16 md:h-16 object-cover rounded border-2 border-green-300 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-xs md:text-sm line-clamp-2">{item.name}</p>
                      <p className="text-xs text-gray-600">Qtd: {item.quantity}</p>
                    </div>
                    <p className="text-base md:text-lg font-bold text-green-600 flex-shrink-0">
                      R$ {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Endereço de Entrega */}
              <div className="bg-white rounded-lg p-3 md:p-4 border border-green-200 mb-3 md:mb-4">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-sm md:text-base">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Endereço de Entrega
                </h3>
                <p className="text-xs md:text-sm text-gray-700">
                  {formData.address}, {formData.number}
                  {formData.complement && ` - ${formData.complement}`}
                </p>
                <p className="text-xs md:text-sm text-gray-700">
                  {formData.neighborhood} - {formData.city}/{formData.state}
                </p>
                <p className="text-xs md:text-sm text-gray-700">CEP: {formData.cep}</p>
                <p className="text-xs text-green-600 font-semibold mt-2">
                  🚚 {getShippingLabel()}
                </p>
              </div>

              {/* Total */}
              <div className="border-t-2 border-green-200 pt-3 md:pt-4">
                <div className="flex justify-between items-center text-lg md:text-2xl font-bold">
                  <span className="text-gray-900">Total a Pagar</span>
                  <span className="text-green-600">R$ {formatPrice(pixData.amount / 100)}</span>
                </div>
              </div>
            </div>

            {/* QR Code e Código PIX */}
            <div className="border-2 border-green-100 rounded-xl p-4 md:p-6 bg-gradient-to-br from-green-50 to-emerald-50">
              <h2 className="text-base md:text-xl font-bold text-gray-900 mb-3 md:mb-4 text-center">
                Escaneie o QR Code para Pagar
              </h2>

              {/* QR Code */}
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg mb-4 md:mb-6 mx-auto w-fit">
                <QRCodeSVG 
                  value={pixData.qr_code} 
                  size={window.innerWidth < 768 ? 240 : 280}
                  level="H"
                  className="mx-auto"
                />
              </div>

              {/* Código PIX Copia e Cola */}
              <div className="bg-white rounded-lg p-3 md:p-4 border-2 border-green-300">
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2">
                  Ou copie o código PIX:
                </label>
                <div className="flex flex-col md:flex-row gap-2">
                  <input
                    type="text"
                    value={pixData.qr_code}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded text-xs font-mono overflow-hidden"
                    style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                  />
                  <button
                    onClick={copyPixCode}
                    className={`w-full md:w-auto px-4 md:px-6 py-2 md:py-2 rounded-lg font-bold transition-all text-sm md:text-base ${
                      pixCopied 
                        ? 'bg-green-600 text-white' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {pixCopied ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copiado!
                      </span>
                    ) : (
                      'Copiar Código'
                    )}
                  </button>
                </div>
              </div>

              {/* Informação do Recebedor */}
              <div className="mt-4 md:mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-3 md:p-4">
                <div className="flex items-start gap-2 md:gap-3">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-bold text-gray-900 text-xs md:text-sm mb-1">Informação Importante:</p>
                    <p className="text-xs md:text-sm text-gray-700">
                      O recebedor deste pagamento aparecerá como <span className="font-bold text-blue-600">VENITY</span>, 
                      parceiro autorizado O Boticário para processamento de pagamentos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instruções */}
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 md:p-6 border-2 border-green-300">
              <h3 className="font-bold text-gray-900 mb-3 md:mb-4 text-base md:text-lg">📱 Como Pagar com PIX:</h3>
              <ol className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-700">
                <li className="flex items-start gap-2 md:gap-3">
                  <span className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-xs">1</span>
                  <span className="pt-0.5">Abra o aplicativo do seu banco</span>
                </li>
                <li className="flex items-start gap-2 md:gap-3">
                  <span className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-xs">2</span>
                  <span className="pt-0.5">Escolha a opção <strong>"Pagar com PIX"</strong></span>
                </li>
                <li className="flex items-start gap-2 md:gap-3">
                  <span className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-xs">3</span>
                  <span className="pt-0.5">Escaneie o QR Code acima ou copie e cole o código</span>
                </li>
                <li className="flex items-start gap-2 md:gap-3">
                  <span className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-xs">4</span>
                  <span className="pt-0.5">Confirme o pagamento de <strong className="text-green-600">R$ {formatPrice(pixData.amount / 100)}</strong></span>
                </li>
                <li className="flex items-start gap-2 md:gap-3">
                  <span className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-xs">5</span>
                  <span className="pt-0.5">Pronto! Você será redirecionado automaticamente após a confirmação</span>
                </li>
              </ol>
            </div>

            {/* Status de Aguardando */}
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-3 md:p-4 flex items-center gap-3 md:gap-4">
              <div className="animate-spin flex-shrink-0">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-yellow-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 mb-1 text-sm md:text-base">Aguardando Pagamento...</p>
                <p className="text-xs md:text-sm text-gray-700">
                  Assim que confirmarmos o pagamento, você será redirecionado automaticamente.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPix
