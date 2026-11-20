import { useState } from 'react'
import { Link } from 'react-router-dom'

const ExemploPix = () => {
  const [copied, setCopied] = useState(false)

  const pedido = {
    numero: 'ORD-1795032114006-35LZ2T',
    valor: 56.60,
    pixCode: '00020126360014br.gov.bcb.pix0114+55119999999990204000053039865802BR5925OBOTICARIO VENDAS LTDA6009SAO PAULO62070503***63041D3A',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020126360014br.gov.bcb.pix0114+55119999999990204000053039865802BR5925OBOTICARIO%20VENDAS%20LTDA6009SAO%20PAULO62070503***63041D3A',
    expiresIn: '14:58'
  }

  const copyPixCode = () => {
    navigator.clipboard.writeText(pedido.pixCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link to="/" className="text-[#246c61] hover:text-[#1d5850] font-medium mb-4 inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Finalize seu Pagamento</h1>
            <p className="text-gray-600">Pedido #{pedido.numero}</p>
          </div>

          {/* Card PIX */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            {/* Valor e Timer */}
            <div className="bg-[#246c61] text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Valor a pagar</p>
                  <p className="text-4xl font-bold">R$ {pedido.valor.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-90 mb-1">Expira em</p>
                  <p className="text-2xl font-bold font-mono">{pedido.expiresIn}</p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Pague com PIX</h2>
                <p className="text-gray-600">Escaneie o QR Code com o app do seu banco</p>
              </div>

              {/* QR Code */}
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8 mb-6 flex justify-center">
                <img 
                  src={pedido.qrCodeUrl} 
                  alt="QR Code PIX" 
                  className="w-64 h-64"
                />
              </div>

              {/* Instruções */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3">Como pagar:</h3>
                <ol className="space-y-2 text-sm text-blue-900">
                  <li className="flex gap-2">
                    <span className="font-bold">1.</span>
                    <span>Abra o app do seu banco</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">2.</span>
                    <span>Escolha <strong>Pagar com PIX</strong></span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">3.</span>
                    <span>Escaneie o QR Code ou cole o código</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">4.</span>
                    <span>Confirme o pagamento</span>
                  </li>
                </ol>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">OU</span>
                </div>
              </div>

              {/* Copiar Código */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Pix Copia e Cola</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  <p className="text-xs text-gray-600 font-mono break-all">
                    {pedido.pixCode}
                  </p>
                </div>
                <button
                  onClick={copyPixCode}
                  className="w-full bg-[#246c61] hover:bg-[#1d5850] text-white font-medium py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Código Copiado!
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copiar Código PIX
                    </>
                  )}
                </button>
              </div>

              {/* Aguardando */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-3 text-gray-600">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#246c61] border-t-transparent"></div>
                  <span className="font-medium">Aguardando pagamento...</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Você receberá um email assim que confirmarmos o pagamento
                </p>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/exemplo-pago"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-center"
            >
              ✓ Simular Pagamento
            </Link>
            <Link
              to="/"
              className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-colors text-center"
            >
              Voltar para Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExemploPix
  const [copied, setCopied] = useState(false)

  // Dados de exemplo
  const pedido = {
    numero: 'ORD-1795032114006-35LZ2T',
    valor: 56.60,
    pixCode: '00020126360014br.gov.bcb.pix0114+55119999999990204000053039865802BR5925OBOTICARIO VENDAS LTDA6009SAO PAULO62070503***63041D3A',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020126360014br.gov.bcb.pix0114+55119999999990204000053039865802BR5925OBOTICARIO%20VENDAS%20LTDA6009SAO%20PAULO62070503***63041D3A',
    expiresIn: '15:00'
  }

  const copyPixCode = () => {
    navigator.clipboard.writeText(pedido.pixCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pedido Criado!</h1>
            <p className="text-gray-600">Pedido #{pedido.numero}</p>
          </div>

          {/* Card Principal */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
            {/* Header do Card */}
            <div className="bg-gradient-to-r from-[#246c61] to-[#1d5850] text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Valor a pagar</p>
                  <p className="text-4xl font-bold">R$ {pedido.valor.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-90 mb-1">Expira em</p>
                  <p className="text-2xl font-bold">{pedido.expiresIn}</p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Pague com PIX</h2>
                <p className="text-gray-600">Escaneie o QR Code abaixo com o app do seu banco</p>
              </div>

              {/* QR Code Box */}
              <div className="bg-white border-4 border-dashed border-[#246c61] rounded-2xl p-8 mb-6 flex justify-center">
                <img 
                  src={pedido.qrCodeUrl} 
                  alt="QR Code PIX" 
                  className="w-64 h-64"
                />
              </div>

              {/* Instruções */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Como pagar:
                </h3>
                <ol className="space-y-2 text-sm text-blue-900">
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <span>Abra o app do seu banco ou carteira digital</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span>Escolha a opção <strong>Pagar com PIX</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <span>Escaneie o QR Code acima ou copie o código</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    <span>Confirme o pagamento</span>
                  </li>
                </ol>
              </div>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-semibold">OU</span>
                </div>
              </div>

              {/* Copiar Código PIX */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Pix Copia e Cola</h3>
                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-600 mb-2 font-mono break-all">
                    {pedido.pixCode}
                  </p>
                </div>
                <button
                  onClick={copyPixCode}
                  className="w-full bg-gradient-to-r from-[#246c61] to-[#1d5850] hover:from-[#1d5850] hover:to-[#246c61] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Código Copiado!
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copiar Código PIX
                    </>
                  )}
                </button>
              </div>

              {/* Aguardando Pagamento */}
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-3 text-gray-600">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#246c61] border-t-transparent"></div>
                  <span className="font-semibold">Aguardando pagamento...</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Assim que confirmarmos o pagamento, você receberá um email de confirmação
                </p>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/exemplo-pago"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-center"
            >
              ✅ Simular Pagamento Confirmado
            </Link>
            <Link
              to="/"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-xl shadow hover:shadow-lg transition-all text-center"
            >
              Voltar para Home
            </Link>
          </div>

          {/* Aviso de Demonstração */}
          <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-bold text-yellow-900 mb-1">⚠️ Página de Demonstração</p>
                <p className="text-sm text-yellow-800">
                  Esta é uma página de exemplo para apresentação ao gateway de pagamento. 
                  Em produção, os dados serão gerados automaticamente pela API.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExemploPix
