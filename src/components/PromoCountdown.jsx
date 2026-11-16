import { useState, useEffect } from 'react'

const PromoCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    // Define o fim da promoção para meia-noite de hoje
    const calculateTimeLeft = () => {
      const now = new Date()
      const midnight = new Date()
      midnight.setHours(24, 0, 0, 0)
      
      const difference = midnight - now
      
      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        const seconds = Math.floor((difference / 1000) % 60)
        
        setTimeLeft({ hours, minutes, seconds })
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-center gap-3 flex-wrap">
        <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        <span className="font-bold text-sm md:text-base">
          OFERTA ESPECIAL ACABA EM:
        </span>
        <div className="flex items-center gap-2">
          <div className="bg-white/20 backdrop-blur-sm rounded px-2 py-1 min-w-[40px] text-center">
            <span className="font-bold text-lg">{String(timeLeft.hours).padStart(2, '0')}</span>
            <div className="text-[10px] opacity-90">HORAS</div>
          </div>
          <span className="font-bold">:</span>
          <div className="bg-white/20 backdrop-blur-sm rounded px-2 py-1 min-w-[40px] text-center">
            <span className="font-bold text-lg">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <div className="text-[10px] opacity-90">MIN</div>
          </div>
          <span className="font-bold">:</span>
          <div className="bg-white/20 backdrop-blur-sm rounded px-2 py-1 min-w-[40px] text-center">
            <span className="font-bold text-lg">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <div className="text-[10px] opacity-90">SEG</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromoCountdown
