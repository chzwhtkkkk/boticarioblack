import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { trackPurchase } from '../utils/tracking'

const Sucesso = () => {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order_id')
  const transactionId = searchParams.get('transaction_id')

  useEffect(() => {
    // Disparar evento de conversão uma única vez
    if (orderId && !sessionStorage.getItem(`purchase_tracked_${orderId}`)) {
      // Marcar como rastreado
      sessionStorage.setItem(`purchase_tracked_${orderId}`, 'true')
      
      // Disparar pixel de conversão
      trackPurchase({
        orderId: orderId,
        items: [], // Não temos os itens aqui, mas o valor já foi rastreado
        total: 0 // O webhook já enviou o valor correto
      })
      
      console.log('🎯 Conversão rastreada para pedido:', orderId)
    }
  }, [orderId])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-green-50 border-b border-green-100 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pagamento Confirmado!</h1>
            <p className="text-gray-600">Seu pedido foi aprovado com sucesso</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Order Info */}
            {orderId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Número do Pedido:</p>
                <p className="text-xl font-bold text-gray-900">{orderId}</p>
                {transactionId && (
                  <>
                    <p className="text-sm text-gray-600 mt-3 mb-1">ID da Transação:</p>
                    <p className="text-sm font-mono text-gray-700">{transactionId}</p>
                  </>
                )}
              </div>
            )}

            {/* Next Steps */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Próximos Passos:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Confirmação por Email</p>
                    <p className="text-sm text-gray-600">Você receberá um email com os detalhes do pedido e o código de rastreio</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Preparação do Pedido</p>
                    <p className="text-sm text-gray-600">Nossa equipe já está separando seus produtos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Envio e Rastreamento</p>
                    <p className="text-sm text-gray-600">Você poderá acompanhar sua entrega em tempo real</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link
                to="/area-cliente"
                className="bg-[#246c61] hover:bg-[#1d5850] text-white font-medium py-3 px-6 rounded-lg transition-colors text-center"
              >
                Acompanhar Pedido
              </Link>
              <Link
                to="/produtos"
                className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-colors text-center"
              >
                Continuar Comprando
              </Link>
            </div>
          </div>
        </div>

        {/* Help */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Precisa de ajuda?</p>
          <a 
            href="https://wa.me/5511999999999" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#246c61] hover:text-[#1d5850] font-medium"
          >
            Fale conosco no WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}

export default Sucesso
