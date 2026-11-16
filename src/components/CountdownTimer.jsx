import { useState, useEffect } from 'react'

const CountdownTimer = ({ hours = 24 }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: hours,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev

        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        }

        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-semibold">⚡ Oferta por tempo limitado!</span>
        </div>
        <div className="flex gap-2">
          <div className="bg-white/20 backdrop-blur-sm rounded px-3 py-1 text-center min-w-[50px]">
            <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="text-xs">Horas</div>
          </div>
          <div className="text-2xl font-bold">:</div>
          <div className="bg-white/20 backdrop-blur-sm rounded px-3 py-1 text-center min-w-[50px]">
            <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="text-xs">Min</div>
          </div>
          <div className="text-2xl font-bold">:</div>
          <div className="bg-white/20 backdrop-blur-sm rounded px-3 py-1 text-center min-w-[50px]">
            <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="text-xs">Seg</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CountdownTimer
