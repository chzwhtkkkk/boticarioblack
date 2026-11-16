import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CouponBanner = () => {
  const [applied, setApplied] = useState(false)
  const navigate = useNavigate()
  const couponCode = 'DESCONTO25'

  const handleApplyCoupon = () => {
    // Salva o cupom no localStorage para ser usado no carrinho
    localStorage.setItem('appliedCoupon', JSON.stringify({
      code: couponCode,
      discount: 25
    }))
    setApplied(true)
    
    // Dispara evento customizado para atualizar os cards de produtos
    window.dispatchEvent(new Event('couponUpdated'))
    
    // Não redireciona mais - apenas mostra que foi aplicado
  }

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg p-6 mb-6 shadow-xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-2xl mb-1">🎉 25% OFF no Site Todo!</p>
            <p className="text-sm text-orange-100">Cupom: <span className="font-bold text-lg">{couponCode}</span></p>
          </div>
        </div>
        <button
          onClick={handleApplyCoupon}
          disabled={applied}
          className={`${
            applied 
              ? 'bg-green-500 cursor-not-allowed' 
              : 'bg-white hover:bg-orange-50'
          } text-orange-600 font-bold px-8 py-4 rounded-lg transition-all flex items-center gap-2 shadow-lg transform hover:scale-105`}
        >
          {applied ? (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Cupom Aplicado!</span>
            </>
          ) : (
            <>
              <span className="text-lg">Resgatar Cupom</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default CouponBanner
