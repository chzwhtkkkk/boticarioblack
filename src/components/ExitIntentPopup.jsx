import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/formatPrice'

const ExitIntentPopup = () => {
  const [showPopup, setShowPopup] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const navigate = useNavigate()
  const { addToCart } = useCart()

  // Produto mais barato para downsell
  const cheapestProduct = products
    .filter(p => p.category === 'Kits e Presentes')
    .sort((a, b) => a.price - b.price)[0]

  useEffect(() => {
    const handleMouseLeave = (e) => {
      // Detecta quando o mouse sai pela parte superior da página
      if (e.clientY <= 0 && !hasShown) {
        setShowPopup(true)
        setHasShown(true)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [hasShown])

  const handleAddAndCheckout = () => {
    addToCart(cheapestProduct)
    setShowPopup(false)
    navigate('/checkout')
  }

  if (!showPopup || !cheapestProduct) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-2 md:p-4 animate-fadeIn">
      <div className="bg-white rounded-xl md:rounded-2xl max-w-2xl w-full shadow-2xl transform animate-scaleIn relative overflow-hidden max-h-[95vh] overflow-y-auto">
        {/* Banner de urgência */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-center py-2 md:py-3 font-bold text-sm md:text-lg animate-pulse">
          ⚠️ ESPERE! NÃO VÁ EMBORA! ⚠️
        </div>

        {/* Botão fechar */}
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-12 md:top-16 right-2 md:right-4 text-gray-500 hover:text-gray-700 transition z-10"
        >
          <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-4 md:p-8">
          <div className="text-center mb-4 md:mb-6">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3">
              🎁 OFERTA EXCLUSIVA! 🎁
            </h2>
            <p className="text-base md:text-xl text-gray-700 font-semibold mb-2">
              Antes de ir, que tal levar nosso KIT MAIS VENDIDO?
            </p>
            <div className="inline-block bg-yellow-400 text-gray-900 px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-lg md:text-2xl animate-bounce">
              🔥 R$ {formatPrice(cheapestProduct.price)} 🔥
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg md:rounded-xl p-4 md:p-6 mb-4 md:mb-6">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <div className="relative w-full md:w-auto flex justify-center">
                <img
                  src={cheapestProduct.image}
                  alt={cheapestProduct.name}
                  className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-lg shadow-lg"
                />
                {cheapestProduct.discount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 md:px-4 py-1 md:py-2 rounded-full font-bold text-sm md:text-lg animate-pulse shadow-lg">
                    -{cheapestProduct.discount}%
                  </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-left w-full">
                <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                  {cheapestProduct.name}
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 line-clamp-2">
                  {cheapestProduct.description}
                </p>

                <div className="flex items-center justify-center md:justify-start gap-2 md:gap-4 mb-3 md:mb-4">
                  {cheapestProduct.discount > 0 && (
                    <span className="text-base md:text-xl text-gray-400 line-through">
                      R$ {formatPrice(cheapestProduct.originalPrice)}
                    </span>
                  )}
                  <span className="text-3xl md:text-4xl font-bold text-green-600">
                    R$ {formatPrice(cheapestProduct.price)}
                  </span>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-1 md:gap-2 text-yellow-500 mb-3 md:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 md:w-6 md:h-6 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                  <span className="text-gray-600 font-semibold text-sm md:text-base ml-1 md:ml-2">
                    ({cheapestProduct.reviews} avaliações)
                  </span>
                </div>

                <div className="bg-white rounded-lg p-3 md:p-4 border-2 border-green-500 mb-3 md:mb-4">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-green-600 font-bold text-sm md:text-base">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>FRETE GRÁTIS para todo Brasil!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleAddAndCheckout}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl text-base md:text-xl transform hover:scale-105 transition-all shadow-lg"
            >
              ✅ SIM! QUERO APROVEITAR
            </button>

            <button
              onClick={() => setShowPopup(false)}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 md:py-3 px-6 md:px-8 rounded-xl transition-all text-sm md:text-base"
            >
              Não, obrigado. Vou perder esta oferta.
            </button>
          </div>

          <div className="text-center mt-3 md:mt-4">
            <p className="text-red-600 font-bold text-sm md:text-base animate-pulse">
              ⏰ Esta oferta expira em 5 minutos!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExitIntentPopup
