import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../../lib/supabase';

export default function OrderConfirmation() {
  const router = useRouter();
  const { orderNumber, payment: paymentId } = router.query;
  const [order, setOrder] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (orderNumber) {
      loadOrder();
    }
  }, [orderNumber]);

  const loadOrder = async () => {
    try {
      // Buscar pedido
      const { data: orderData, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(*),
          items:order_items(*)
        `)
        .eq('order_number', orderNumber)
        .single();

      if (error) throw error;

      setOrder(orderData);

      // Se tiver ID do pagamento, buscar dados do pagamento
      if (paymentId && orderData.avenpay_payment_id) {
        // Aqui você poderia buscar os dados do pagamento da Avenpay
        // Por enquanto vamos simular com dados do pedido
        setPaymentData({
          id: orderData.avenpay_payment_id,
          method: orderData.payment_method,
          status: orderData.payment_status
        });
      }

    } catch (error) {
      console.error('Erro ao carregar pedido:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyPixCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando pedido...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pedido não encontrado</h2>
          <button
            onClick={() => router.push('/')}
            className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700"
          >
            Voltar para a Loja
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Pedido {orderNumber} - O Boticário</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Cabeçalho de Sucesso */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Pedido Realizado com Sucesso!
              </h1>
              <p className="text-gray-600 mb-4">
                Número do pedido: <span className="font-semibold text-pink-600">{orderNumber}</span>
              </p>
              <p className="text-sm text-gray-500">
                Enviamos um email de confirmação para {order.customer.email}
              </p>
            </div>
          </div>

          {/* Informações de Pagamento */}
          {order.payment_method === 'PIX' && order.payment_status === 'pending' && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Pagamento via PIX</h2>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 font-medium">
                  ⏰ Aguardando pagamento
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Escaneie o QR Code ou copie o código PIX para pagar
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* QR Code - Simulação */}
                <div className="text-center">
                  <div className="bg-gray-100 w-64 h-64 flex items-center justify-center mx-auto rounded-lg">
                    <p className="text-gray-400">QR Code PIX</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Escaneie com o app do seu banco
                  </p>
                </div>

                {/* Código PIX Copia e Cola */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código PIX Copia e Cola
                  </label>
                  <div className="relative">
                    <textarea
                      readOnly
                      value="00020101021126580014br.gov.bcb.pix..."
                      className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    />
                    <button
                      onClick={() => copyPixCode('00020101021126580014br.gov.bcb.pix...')}
                      className="absolute top-2 right-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 text-sm"
                    >
                      {copied ? '✓ Copiado!' : 'Copiar'}
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    1. Copie o código acima<br />
                    2. Abra o app do seu banco<br />
                    3. Escolha Pix Copia e Cola<br />
                    4. Cole o código e confirme
                  </p>
                </div>
              </div>
            </div>
          )}

          {order.payment_method === 'BOLETO' && order.payment_status === 'pending' && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Pagamento via Boleto</h2>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 font-medium">
                  ⏰ Aguardando pagamento
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  O boleto pode levar até 2 dias úteis para compensar
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código de Barras
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value="34191.79001 01043.510047 91020.150008"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-mono"
                    />
                    <button
                      onClick={() => copyPixCode('34191790010104351004791020150008')}
                      className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
                    >
                      {copied ? '✓ Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => window.open('#', '_blank')}
                  className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 font-medium"
                >
                  📄 Baixar Boleto (PDF)
                </button>
              </div>
            </div>
          )}

          {order.payment_method === 'CREDIT_CARD' && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Pagamento via Cartão de Crédito</h2>
              
              {order.payment_status === 'paid' ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    ✅ Pagamento Aprovado!
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Seu pedido já está sendo preparado para envio
                  </p>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 font-medium">
                    🔄 Processando pagamento...
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Aguarde alguns instantes
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Detalhes do Pedido */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Detalhes do Pedido</h2>
            
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b">
                  <img 
                    src={item.product_image} 
                    alt={item.product_name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product_name}</h3>
                    <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                    <p className="text-pink-600 font-semibold">
                      R$ {(item.total_price / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {(order.subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete:</span>
                <span>R$ {(order.shipping_fee / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span className="text-pink-600">R$ {(order.total / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Endereço de Entrega */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Endereço de Entrega</h2>
            <p className="text-gray-700">
              {order.shipping_address.street}, {order.shipping_address.number}
              {order.shipping_address.complement && ` - ${order.shipping_address.complement}`}
              <br />
              {order.shipping_address.neighborhood} - {order.shipping_address.city}/{order.shipping_address.state}
              <br />
              CEP: {order.shipping_address.zipCode}
            </p>
          </div>

          {/* Rastreamento */}
          {order.tracking_code && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Rastreamento</h2>
              <p className="text-gray-600 mb-4">
                Código de rastreio: <span className="font-semibold">{order.tracking_code}</span>
              </p>
              <button
                onClick={() => router.push(`/rastreio?codigo=${order.tracking_code}`)}
                className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700"
              >
                Rastrear Pedido
              </button>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 font-medium"
            >
              Continuar Comprando
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 font-medium"
            >
              Imprimir Pedido
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
