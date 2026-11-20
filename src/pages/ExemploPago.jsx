import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

const ExemploPago = () => {
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    setTimeout(() => setShowConfetti(false), 3000)
  }, [])

  const pedido = {
    numero: 'ORD-1795032114006-35LZ2T',
    valor: 56.60,
    produtos: [
      {
        nome: 'Kit Presente Cuide-se Bem Deleite (4 itens)',
        quantidade: 1,
        preco: 41.60,
        imagem: '/images/black26/D_NQ_NP_2X_754901-MLB118676520563_102026-F-kit-presente-cuidese-bem-deleite-4-itens-o-boticario 2.webp'
      }
    ],
    frete: 15.00,
    dataPagamento: new Date().toLocaleString('pt-BR'),
    cliente: {
      nome: 'João da Silva',
      email: 'joao@email.com'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              🎉
            </div>
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Animation */}
          <div className="text-center mb-8 animate-fadeIn">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6 animate-bounce-slow shadow-2xl">
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Pagamento Confirmado! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-2">Seu pedido foi aprovado com sucesso</p>
            <p className="text-lg text-green-600 font-semibold">
              Pedido #{pedido.numero}
            </p>
          </div>

          {/* Card Principal */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6 border-2 border-green-100">
            {/* Header Verde */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Valor Pago</p>
                  <p className="text-3xl font-bold">R$ {pedido.valor.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <div className="bg-white bg-opacity-20 rounded-full px-4 py-2">
                    <p className="text-sm font-semibold">✅ PAGO</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-6">
              {/* Status */}
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-green-900 mb-2">Pagamento Aprovado!</h3>
                    <p className="text-green-700 mb-3">
                      Recebemos a confirmação do seu pagamento via PIX em <strong>{pedido.dataPagamento}</strong>
                    </p>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">📧 <strong>Enviamos um email para:</strong></p>
                      <p className="text-gray-900 font-semibold">{pedido.cliente.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Próximos Passos */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-[#246c61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Próximos Passos
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900">Preparando seu pedido</p>
                      <p className="text-sm text-blue-700">Nossa equipe já está separando seus produtos</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-purple-900">Enviando para a transportadora</p>
                      <p className="text-sm text-purple-700">Em breve você receberá o código de rastreio</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-green-900">Pedido a caminho!</p>
                      <p className="text-sm text-green-700">Você poderá rastrear a entrega em tempo real</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Produtos */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-[#246c61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Itens do Pedido
                </h3>
                <div className="space-y-3">
                  {pedido.produtos.map((produto, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                      <img
                        src={produto.imagem}
                        alt={produto.nome}
                        className="w-20 h-20 object-cover rounded-lg border-2 border-[#246c61]"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{produto.nome}</p>
                        <p className="text-sm text-gray-600">Quantidade: {produto.quantidade}</p>
                      </div>
                      <p className="font-bold text-[#246c61] text-lg">
                        R$ {produto.preco.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumo */}
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Resumo do Pedido</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">R$ {pedido.produtos[0].preco.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Frete</span>
                    <span className="font-semibold">R$ {pedido.frete.toFixed(2)}</span>
                  </div>
                  <div className="border-t-2 border-gray-300 pt-2 flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total Pago</span>
                    <span className="text-2xl font-bold text-green-600">
                      R$ {pedido.valor.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Link
              to="/exemplo-enviando"
              className="bg-gradient-to-r from-[#246c61] to-[#1d5850] hover:from-[#1d5850] hover:to-[#246c61] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-center flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Ver Status de Envio
            </Link>
            <Link
              to="/"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-xl shadow hover:shadow-lg transition-all text-center"
            >
              Voltar para Home
            </Link>
          </div>

          {/* Aviso de Demonstração */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-bold text-yellow-900 mb-1">⚠️ Página de Demonstração</p>
                <p className="text-sm text-yellow-800">
                  Esta é uma simulação da página de confirmação de pagamento para apresentação ao gateway.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(-5%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
      `}</style>
    </div>
  )
}

export default ExemploPago
