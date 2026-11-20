import { Link } from 'react-router-dom'

const ExemploPago = () => {
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header de Sucesso */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pagamento Confirmado!</h1>
            <p className="text-gray-600">Pedido #{pedido.numero}</p>
          </div>

          {/* Card Principal */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            {/* Status */}
            <div className="p-6 bg-green-50 border-b border-green-100">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Pagamento aprovado</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Recebemos a confirmação do seu pagamento via PIX em <strong>{pedido.dataPagamento}</strong>
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-gray-600 mb-1">✉️ Email de confirmação enviado para:</p>
                    <p className="text-sm font-semibold text-gray-900">{pedido.cliente.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Próximos Passos */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Próximos Passos</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Preparando seu pedido</p>
                    <p className="text-sm text-gray-600">Nossa equipe está separando seus produtos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Código de rastreio</p>
                    <p className="text-sm text-gray-600">Você receberá o código por email em breve</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Entrega</p>
                    <p className="text-sm text-gray-600">Acompanhe seu pedido em tempo real</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Produtos */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Itens do Pedido</h3>
              <div className="space-y-3">
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
                    <p className="font-semibold text-gray-900">
                      R$ {produto.preco.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumo */}
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Resumo</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>R$ {pedido.produtos[0].preco.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Frete</span>
                  <span>R$ {pedido.frete.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between">
                  <span className="font-semibold text-gray-900">Total Pago</span>
                  <span className="font-bold text-green-600 text-lg">
                    R$ {pedido.valor.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/exemplo-enviando"
              className="bg-[#246c61] hover:bg-[#1d5850] text-white font-medium py-3 px-6 rounded-lg transition-colors text-center"
            >
              Ver Status de Envio
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

export default ExemploPago
