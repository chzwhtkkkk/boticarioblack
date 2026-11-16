import { useState, useEffect } from 'react'

const LeadCapturePopup = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Check if user already submitted
    const hasSubmitted = localStorage.getItem('leadCaptured')
    if (hasSubmitted) return

    // Show popup after 10 seconds
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Save to localStorage (in production, send to backend/API)
    localStorage.setItem('leadCaptured', 'true')
    localStorage.setItem('leadName', name)
    localStorage.setItem('leadPhone', phone)
    
    setSubmitted(true)
    
    // Close after 2 seconds
    setTimeout(() => {
      setIsOpen(false)
    }, 2000)
  }

  const handleClose = () => {
    setIsOpen(false)
    // Show again after 5 minutes if not submitted
    if (!submitted) {
      setTimeout(() => {
        const hasSubmitted = localStorage.getItem('leadCaptured')
        if (!hasSubmitted) {
          setIsOpen(true)
        }
      }, 300000) // 5 minutes
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Popup */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!submitted ? (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6 text-center">
              <div className="text-5xl mb-3">🎁</div>
              <h3 className="text-2xl font-bold mb-2">
                GANHE 10% OFF
              </h3>
              <p className="text-pink-100">
                na sua primeira compra!
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <p className="text-gray-600 mb-6 text-center">
                Cadastre-se e receba ofertas exclusivas no WhatsApp 📱
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seu Nome
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Digite seu nome"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-4 rounded-lg hover:from-pink-600 hover:to-rose-600 transform hover:scale-105 transition-all shadow-lg"
                >
                  QUERO MEUS 10% OFF! 🎉
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                Ao cadastrar, você concorda em receber ofertas exclusivas
              </p>
            </form>
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Cadastro Realizado!
            </h3>
            <p className="text-gray-600">
              Suas ofertas serão enviadas no WhatsApp em instantes! 🎁
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LeadCapturePopup
