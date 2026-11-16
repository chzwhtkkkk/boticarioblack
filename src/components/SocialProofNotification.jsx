import { useState, useEffect } from 'react'

const SocialProofNotification = () => {
  const [show, setShow] = useState(false)
  const [currentNotification, setCurrentNotification] = useState(null)

  // Lista de notificações fake (prova social)
  const notifications = [
    { name: 'Joelma Silva', product: 'Lily Eau de Parfum', city: 'São Paulo - SP', time: '3 minutos atrás' },
    { name: 'Maria Santos', product: 'Malbec X Eau de Toilette', city: 'Rio de Janeiro - RJ', time: '5 minutos atrás' },
    { name: 'Ana Costa', product: 'Kit Her Code', city: 'Belo Horizonte - MG', time: '7 minutos atrás' },
    { name: 'Carla Oliveira', product: 'Floratta Red Eau de Toilette', city: 'Salvador - BA', time: '10 minutos atrás' },
    { name: 'Paula Rodrigues', product: 'Coffee Woman Seduction', city: 'Brasília - DF', time: '12 minutos atrás' },
    { name: 'Fernanda Lima', product: 'Egeo Dolce Eau de Toilette', city: 'Porto Alegre - RS', time: '15 minutos atrás' },
    { name: 'Juliana Mendes', product: 'Kit Nativa Spa', city: 'Curitiba - PR', time: '18 minutos atrás' },
    { name: 'Beatriz Alves', product: 'Quasar Evolution', city: 'Recife - PE', time: '20 minutos atrás' },
  ]

  useEffect(() => {
    // Mostra primeira notificação após 3 segundos
    const initialTimeout = setTimeout(() => {
      showRandomNotification()
    }, 3000)

    // Depois mostra nova notificação a cada 8-12 segundos
    const interval = setInterval(() => {
      showRandomNotification()
    }, Math.random() * 4000 + 8000) // Entre 8 e 12 segundos

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [])

  const showRandomNotification = () => {
    const randomIndex = Math.floor(Math.random() * notifications.length)
    setCurrentNotification(notifications[randomIndex])
    setShow(true)

    // Esconde após 5 segundos
    setTimeout(() => {
      setShow(false)
    }, 5000)
  }

  if (!show || !currentNotification) return null

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-slideInLeft">
      <div className="bg-white rounded-lg shadow-2xl border-2 border-green-500 p-4 max-w-sm flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {currentNotification.name.charAt(0)}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="font-bold text-sm text-gray-900 truncate">{currentNotification.name}</p>
          </div>
          <p className="text-xs text-gray-700 mb-1">
            Acabou de comprar <strong>{currentNotification.product}</strong>
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{currentNotification.city}</span>
            <span className="mx-1">•</span>
            <span>{currentNotification.time}</span>
          </div>
        </div>

        {/* Botão fechar */}
        <button
          onClick={() => setShow(false)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default SocialProofNotification
