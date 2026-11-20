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
      { 
        data: '18/11 16:30', 
        status: 'Pedido Realizado', 
        completo: true, 
        iconSvg: (
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      },
      { 
        data: '18/11 16:32', 
        status: 'Pagamento Confirmado', 
        completo: true, 
        iconSvg: (
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        )
      },
      { 
        data: '19/11 10:15', 
        status: 'Pedido Postado', 
        completo: true, 
        iconSvg: (
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        )
      },
      { 
        data: '20/11 14:22', 
        status: 'Em Trânsito', 
        completo: true, 
        iconSvg: (
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
        ),
        atual: true 
      },
      { 
        data: 'Prev: 25/11', 
        status: 'Saiu p/ Entrega', 
        completo: false, 
        iconSvg: (
          <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        )
      },
      { 
        data: 'Prev: 25/11', 
        status: 'Entregue', 
        completo: false, 
        iconSvg: (
          <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        )
      }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Simples */}
          <div className="mb-8">
            <Link to="/" className="text-[#246c61] hover:text-[#1d5850] font-medium mb-4 inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Acompanhe seu Pedido</h1>
            <p className="text-gray-600">Pedido #{pedido.numero}</p>
          </div>

          {/* Card Principal */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            {/* Código de Rastreio */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Código de Rastreio</p>
                  <p className="text-2xl font-bold text-gray-900 font-mono">{pedido.rastreio}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigator.clipboard.writeText(pedido.rastreio)}
                    className="bg-[#246c61] hover:bg-[#1d5850] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copiar
                  </button>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-6 md:p-8">
              {/* Container dos Steps */}
              <div className="relative">
                <div className="flex items-start justify-between mb-8">
                  {pedido.timeline.map((evento, index) => (
                    <div key={index} className="flex-1 relative">
                      {/* Linha de Conexão */}
                      {index < pedido.timeline.length - 1 && (
                        <div className="absolute top-6 left-1/2 w-full h-0.5 -z-10">
                          <div className={`h-full ${
                            evento.completo ? 'bg-[#246c61]' : 'bg-gray-200'
                          }`}></div>
                        </div>
                      )}

                      {/* Step */}
                      <div className="flex flex-col items-center">
                        {/* Círculo/Ícone */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          evento.completo 
                            ? evento.atual 
                              ? 'bg-[#246c61] shadow-lg shadow-[#246c61]/30' 
                              : 'bg-[#246c61]'
                            : 'bg-gray-200'
                        }`}>
                          {evento.iconSvg}
                        </div>

                        {/* Texto */}
                        <div className="mt-3 text-center px-1">
                          <p className={`text-xs font-semibold mb-1 ${
                            evento.completo ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            {evento.status}
                          </p>
                          <p className={`text-xs ${
                            evento.completo ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            {evento.data}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status Atual */}
                <div className="bg-[#246c61]/5 border border-[#246c61]/20 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#246c61] rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-0.5">Seu pedido está a caminho</p>
                      <p className="text-sm text-gray-600">Previsão de entrega: <span className="font-semibold text-[#246c61]">{pedido.previsaoEntrega}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="p-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Endereço de Entrega</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>{pedido.endereco.rua}, {pedido.endereco.numero}</p>
                <p>{pedido.endereco.bairro} - {pedido.endereco.cidade}/{pedido.endereco.estado}</p>
                <p>CEP: {pedido.endereco.cep}</p>
              </div>
            </div>

            {/* Produtos */}
            <div className="p-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Produtos</h3>
              {pedido.produtos.map((produto, index) => (
                <div key={index} className="flex items-center gap-4">
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="w-16 h-16 object-cover rounded border border-gray-200"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{produto.nome}</p>
                    <p className="text-xs text-gray-500">Qtd: {produto.quantidade}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botões */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/area-cliente"
              className="bg-[#246c61] hover:bg-[#1d5850] text-white font-medium py-3 px-6 rounded-lg transition-colors text-center"
            >
              Ver Todos os Pedidos
            </Link>
            <Link
              to="/"
              className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-colors text-center"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExemploEnviando
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
      { 
        data: '18/11/2024 16:30', 
        status: 'Pedido Realizado', 
        completo: true, 
        iconSvg: (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      },
      { 
        data: '18/11/2024 16:32', 
        status: 'Pagamento Confirmado', 
        completo: true, 
        iconSvg: (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      },
      { 
        data: '19/11/2024 10:15', 
        status: 'Pedido Postado', 
        completo: true, 
        iconSvg: (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        )
      },
      { 
        data: '20/11/2024 14:22', 
        status: 'Em Trânsito', 
        completo: true, 
        iconSvg: (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
        ),
        atual: true 
      },
      { 
        data: 'Previsão: 25/11', 
        status: 'Saiu para Entrega', 
        completo: false, 
        iconSvg: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        )
      },
      { 
        data: 'Previsão: 25/11', 
        status: 'Entregue', 
        completo: false, 
        iconSvg: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        )
      }
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
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Status do Pedido
              </h2>

              {/* Timeline Horizontal - Estilo Moderno */}
              <div className="relative">
                {/* Container dos Steps */}
                <div className="flex items-start justify-between mb-4">
                  {pedido.timeline.map((evento, index) => (
                    <div key={index} className="flex-1 relative">
                      {/* Linha de Conexão */}
                      {index < pedido.timeline.length - 1 && (
                        <div className="absolute top-8 left-1/2 w-full h-1 -z-10">
                          <div className={`h-full ${
                            evento.completo ? 'bg-green-500' : 'bg-gray-300'
                          }`}></div>
                        </div>
                      )}

                      {/* Step */}
                      <div className="flex flex-col items-center">
                        {/* Círculo/Ícone */}
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${
                          evento.completo 
                            ? evento.atual 
                              ? 'bg-green-500 ring-4 ring-green-200 scale-110 animate-pulse' 
                              : 'bg-green-500'
                            : 'bg-gray-300'
                        }`}>
                          {evento.iconSvg}
                        </div>

                        {/* Texto */}
                        <div className="mt-4 text-center">
                          <p className={`font-bold text-sm mb-1 ${
                            evento.completo ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            {evento.status}
                          </p>
                          <p className={`text-xs ${
                            evento.completo ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {evento.data}
                          </p>
                          {evento.atual && (
                            <span className="inline-block mt-2 text-xs bg-green-500 text-white px-3 py-1 rounded-full font-semibold">
                              Atual
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detalhes do Status Atual */}
                <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-green-900 mb-2">🚚 Seu pedido está a caminho!</h3>
                      <p className="text-green-700 mb-3">
                        O pedido foi postado em <strong>19/11/2024 às 10:15</strong> e está em trânsito para o endereço de entrega.
                      </p>
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <p className="text-sm text-gray-600 mb-2">
                          📍 <strong>Previsão de entrega:</strong>
                        </p>
                        <p className="text-2xl font-bold text-green-600">{pedido.previsaoEntrega}</p>
                      </div>
                    </div>
                  </div>
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
