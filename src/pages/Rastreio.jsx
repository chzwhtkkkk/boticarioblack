import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Rastreio() {
  const router = useRouter();
  const { codigo } = router.query;

  useEffect(() => {
    // Configurar o widget do DiaLOG
    if (typeof window !== 'undefined') {
      window.DiaLOGTrackingConfig = {
        containerId: "dialog-tracking-widget",
        primaryColor: "#db2777", // Rosa do Boticário
        title: "Rastreie seu Pedido",
        subtitle: "Digite o código de rastreio para acompanhar sua encomenda em tempo real."
      };

      // Carregar o script do DiaLOG
      const script = document.createElement('script');
      script.src = 'https://acompanhar.my-trackcode.online/widget/tracking-widget.js';
      script.defer = true;
      script.onerror = function() {
        // Fallback se o script principal falhar
        this.onerror = null;
        const fallbackScript = document.createElement('script');
        fallbackScript.src = 'https://dnpgrcriaqpcybhzikvh.supabase.co/functions/v1/tracking-widget';
        fallbackScript.defer = true;
        fallbackScript.onerror = function() {
          console.error('[DiaLOG] Widget indisponível.');
          const container = document.getElementById('dialog-tracking-widget');
          if (container) {
            container.innerHTML = `
              <div style="padding:24px;text-align:center;font-family:sans-serif;color:#6b7280;border:1px dashed #e5e7eb;border-radius:12px">
                Widget de rastreio temporariamente indisponível.
              </div>
            `;
          }
        };
        document.head.appendChild(fallbackScript);
      };
      document.head.appendChild(script);

      return () => {
        // Cleanup: remover scripts quando componente desmontar
        script.remove();
      };
    }
  }, []);

  return (
    <>
      <Head>
        <title>Rastreamento de Pedido - O Boticário</title>
        <meta name="description" content="Rastreie seu pedido O Boticário em tempo real" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Rastreamento de Pedido
            </h1>
            <p className="text-gray-600 text-lg">
              Acompanhe seu pedido em tempo real
            </p>
          </div>

          {/* Widget do DiaLOG */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div id="dialog-tracking-widget"></div>
          </div>

          {/* Informações Adicionais */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Como funciona o rastreamento?
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-pink-600 font-bold text-lg">1</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Código de Rastreio</h3>
                  <p className="text-gray-600">
                    Você recebeu um código de rastreio por email após a confirmação do pagamento.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-pink-600 font-bold text-lg">2</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Digite o Código</h3>
                  <p className="text-gray-600">
                    Cole ou digite o código de rastreio no campo acima para acompanhar seu pedido.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-pink-600 font-bold text-lg">3</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Acompanhe em Tempo Real</h3>
                  <p className="text-gray-600">
                    Veja todas as atualizações da sua encomenda, desde a postagem até a entrega.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Perguntas Frequentes
            </h2>
            
            <div className="space-y-4">
              <details className="group">
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between py-3 border-b">
                  <span>Não recebi meu código de rastreio</span>
                  <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="text-gray-600 py-3">
                  O código de rastreio é enviado por email após a confirmação do pagamento e postagem do pedido. 
                  Isso pode levar de 1 a 3 dias úteis. Verifique sua caixa de spam ou entre em contato conosco.
                </p>
              </details>

              <details className="group">
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between py-3 border-b">
                  <span>Meu código não está funcionando</span>
                  <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="text-gray-600 py-3">
                  Certifique-se de digitar o código corretamente, sem espaços extras. 
                  Se o problema persistir, pode ser que o pedido ainda não tenha sido postado. 
                  Aguarde algumas horas e tente novamente.
                </p>
              </details>

              <details className="group">
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between py-3 border-b">
                  <span>Quanto tempo leva para receber?</span>
                  <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="text-gray-600 py-3">
                  O prazo de entrega varia de acordo com sua região e o método de envio escolhido. 
                  Normalmente é de 5 a 15 dias úteis após a postagem. Você pode acompanhar a previsão 
                  pelo código de rastreio.
                </p>
              </details>

              <details className="group">
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between py-3 border-b">
                  <span>Preciso estar em casa para receber?</span>
                  <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="text-gray-600 py-3">
                  Sim, é necessário que alguém esteja no endereço para receber e assinar o pedido. 
                  Se não houver ninguém, os Correios deixarão um aviso para você retirar na agência ou 
                  reagendar a entrega.
                </p>
              </details>
            </div>
          </div>

          {/* Botão Voltar */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-2 bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar para a Loja
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
