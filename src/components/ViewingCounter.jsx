import { useState, useEffect } from 'react'

const ViewingCounter = () => {
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 15) + 8) // 8-22 pessoas

  useEffect(() => {
    const interval = setInterval(() => {
      // Varia o número de pessoas vendo entre -2 e +3
      setViewers(prev => {
        const change = Math.floor(Math.random() * 6) - 2
        const newValue = prev + change
        return Math.max(5, Math.min(25, newValue)) // Mantém entre 5 e 25
      })
    }, 8000) // Atualiza a cada 8 segundos

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center gap-3">
      <div className="relative">
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
          {viewers}
        </span>
      </div>
      <div>
        <p className="text-sm font-semibold text-blue-900">
          <span className="text-blue-600 font-bold">{viewers} pessoas</span> estão vendo este produto agora
        </p>
      </div>
    </div>
  )
}

export default ViewingCounter
