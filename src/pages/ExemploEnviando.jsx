import { Link } from 'react-router-dom'

const ExemploEnviando = () => {
  const pedido = {
    numero: 'ORD-1795032114006-35LZ2T',
    status: 'em_transito',
    rastreio: 'BR123456789BR',
    previsaoEntrega: '25/11/2024',
    valor: 56.60,
    dataPedido: '18/11/2024 16:30',
    dataPagamento: '18/11/2024 16:32',
    dataPostagem: '19/11/2024 10:15',
    produtos: [
      {
        nome: 'Kit Presente Cuide-se Bem Deleite (4 itens)',
        quantidade: 1,
        imagem: '/images/black26/D_NQ_NP_2X_754901-MLB118676520563_102026-F-kit-presente-cuidese-bem-deleite-4-itens-o-boticario 2.webp'
      }
    ],
    endereco: {
      rua: 'Avenida Foz do Iguaçu',
      numero: '530',
      bairro: 'Jardim Terra Rica',
      cidade: 'Sinop',
      estado: 'MT',
      cep: '78557-530'
    },
    timeline: [
      { data: '18/11/2024 16:30', status: 'Pedido Realizado', completo: true, icon: '🛍️' },
      { data: '18/11/2024 16:32', status: 'Pagamento Confirmado', completo: true, icon: '✅' },
      { data: '19/11/2024 10:15', status: 'Pedido Postado', completo: true, icon: '📦' },
      { data: '20/11/2024 14:22', status: 'Em Trânsito', completo: true, icon: '🚚', atual: true },
      { data: 'Previsão: 25/11', status: 'Saiu para Entrega', completo: false, icon: '🏃' },
      { data: 'Previsão: 25/11', status: 'Entregue', completo: false, icon: '🎉' }
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4 animate-pulse">
              <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Pedido em Trânsito 🚚</h1>
            <p className="text-gray-600 text-lg">Pedido #{pedido.numero}</p>
          </div>

          {/* Status Card Principal */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6 border-2 border-purple-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Status do Pedido</p>
                  <p className="text-2xl font-bold">Em Trânsito</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-90 mb-1">Previsão de Entrega</p>
                  <p className="text-2xl font-bold">{pedido.previsaoEntrega}</p>
                </div>
              </div>
            </div>

            {/* Código de Rastreio */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Código de Rastreio</p>
                  <p className="text-3xl font-bold text-purple-600 font-mono">{pedido.rastreio}</p>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(pedido.rastreio)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copiar
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Linha do Tempo
              </h2>

              <div className="relative">
                {/* Linha vertical */}
                <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-purple-500 to-gray-300"></div>

                {/* Eventos */}
                <div className="space-y-8">
                  {pedido.timeline.map((evento, index) => (
                    <div key={index} className="relative flex items-start gap-4">
                      {/* Ícone */}
                      <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg ${
                        evento.completo 
                          ? evento.atual 
                            ? 'bg-purple-500 ring-4 ring-purple-200 animate-pulse' 
                            : 'bg-green-500'
                          : 'bg-gray-300'
                      }`}>
                        {evento.icon}
                      </div>

                      {/* Conteúdo */}
                      <div className={`flex-1 pb-8 ${evento.atual ? 'animate-pulse-slow' : ''}`}>
                        <div className={`p-4 rounded-xl border-2 ${
                          evento.completo 
                            ? evento.atual
                              ? 'bg-purple-50 border-purple-300 shadow-lg'
                              : 'bg-green-50 border-green-300'
                            : 'bg-gray-50 border-gray-300'
                        }`}>
                          <div className="flex items-start justify-between">
                            <div>
                              <p className={`font-bold text-lg mb-1 ${
                                evento.completo ? 'text-gray-900' : 'text-gray-500'
                              }`}>
                                {evento.status}
                                {evento.atual && (
                                  <span className="ml-2 text-sm bg-purple-600 text-white px-2 py-1 rounded-full">
                                    Atual
                                  </span>
                                )}
                              </p>
                              <p className={`text-sm ${
                                evento.completo ? 'text-gray-600' : 'text-gray-400'
                              }`}>
                                {evento.data}
                              </p>
                            </div>
                            {evento.completo && !evento.atual && (
                              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Endereço de Entrega */}
            <div className="p-6 bg-gray-50 border-t-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Endereço de Entrega
              </h3>
              <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                <p className="text-gray-900 font-semibold">{pedido.endereco.rua}, {pedido.endereco.numero}</p>
                <p className="text-gray-700">{pedido.endereco.bairro}</p>
                <p className="text-gray-700">{pedido.endereco.cidade}/{pedido.endereco.estado}</p>
                <p className="text-gray-700">CEP: {pedido.endereco.cep}</p>
              </div>
            </div>

            {/* Produtos */}
            <div className="p-6 border-t-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Produtos no Pedido
              </h3>
              {pedido.produtos.map((produto, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="w-20 h-20 object-cover rounded-lg border-2 border-purple-600"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{produto.nome}</p>
                    <p className="text-sm text-gray-600">Quantidade: {produto.quantidade}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Link
              to="/rastreio"
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-center flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Rastrear no Site
            </Link>
            <Link
              to="/area-cliente"
              className="bg-[#246c61] hover:bg-[#1d5850] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-center flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Meus Pedidos
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
                  Esta é uma simulação da página de acompanhamento de pedido para apresentação ao gateway.
                  Mostra a integração completa: Pagamento → DiaLOG → Email → Rastreamento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default ExemploEnviando
