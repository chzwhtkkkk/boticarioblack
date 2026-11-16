import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const Rastreio = () => {
  const [searchParams] = useSearchParams()
  const codigo = searchParams.get('codigo')
  const [trackingCode, setTrackingCode] = useState(codigo || '')

  const handleTrack = (e) => {
    e.preventDefault()
    if (trackingCode.trim()) {
      // Redireciona para WhatsApp com o código de rastreio
      const message = `Olá! Gostaria de rastrear meu pedido. Código: ${trackingCode}`
      window.open(`https://wa.me/5511951947983?text=${encodeURIComponent(message)}`, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📦 Rastreamento de Pedido
            </h1>
            <p className="text-xl text-gray-600">
              Acompanhe sua encomenda em tempo real
            </p>
          </div>

          {/* Formulário de Rastreio */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleTrack} className="space-y-6">
              <div>
                <label htmlFor="tracking-code" className="block text-lg font-semibold text-gray-900 mb-3">
                  Digite seu código de rastreio:
                </label>
                <input
                  id="tracking-code"
                  type="text"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  placeholder="Ex: BR123456789BR"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#246c61] focus:border-transparent"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-[#246c61] hover:bg-[#1d5850] text-white font-bold py-4 px-6 rounded-lg transition-all text-lg flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Rastrear Pedido
              </button>
            </form>

            {/* Informação sobre o rastreamento */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 text-center">
                💬 Ao clicar em "Rastrear Pedido", você será direcionado para nosso WhatsApp onde nossa equipe irá fornecer todas as informações sobre sua entrega.
              </p>
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Como rastrear seu pedido:
            </h3>
            <ol className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span>Digite o <strong>código de rastreio</strong> que você recebeu por email</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span>Clique em <strong>"Rastrear"</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span>Nossa equipe irá fornecer o status atualizado da sua entrega via WhatsApp</span>
              </li>
            </ol>
          </div>

          {/* Dúvidas */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-4">
              Não recebeu o código de rastreio?
            </p>
            <a
              href={`https://wa.me/5511951947983?text=${encodeURIComponent('Olá! Não recebi o código de rastreio do meu pedido. Pode me ajudar?')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Falar no WhatsApp
            </a>
          </div>

          {/* Voltar para loja */}
          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-gray-600 hover:text-gray-900 font-medium transition"
            >
              ← Voltar para a Loja
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Rastreio
