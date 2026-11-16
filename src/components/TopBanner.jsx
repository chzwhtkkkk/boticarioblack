import { useState } from 'react'
import { Link } from 'react-router-dom'

const TopBanner = () => {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-black text-white py-2 relative animate-fadeIn border-b-2 border-yellow-400">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 text-sm md:text-base font-bold">
          <span className="animate-pulse-slow text-yellow-400">🖤</span>
          <Link to="/produtos" className="hover:underline">
            BLACK FRIDAY | DESCONTOS DE ATÉ 75% + FRETE GRÁTIS
          </Link>
          <span className="animate-pulse-slow text-yellow-400">🖤</span>
        </div>
      </div>
      
      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-gray-200 transition"
        aria-label="Fechar banner"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default TopBanner
