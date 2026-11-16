import { useState } from 'react'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      question: '🚚 Como funciona o frete?',
      answer: 'O frete é GRÁTIS para todo o Brasil! Não importa o valor da compra, você não paga nada pelo envio. Enviamos via Correios com código de rastreamento.'
    },
    {
      question: '🏪 Posso retirar na loja?',
      answer: 'SIM! Você pode retirar seu pedido GRATUITAMENTE em uma loja O Boticário mais próxima de você em até 3 horas após a confirmação do pagamento! É rápido, prático e sem custo adicional. Basta selecionar a opção "Retirada na Loja" no checkout.'
    },
    {
      question: '⏰ Quanto tempo demora a entrega?',
      answer: 'O prazo de entrega varia de acordo com sua região: Sul e Sudeste: 3-7 dias úteis | Centro-Oeste e Nordeste: 5-10 dias úteis | Norte: 7-15 dias úteis. Você recebe o código de rastreamento por email.'
    },
    {
      question: '✅ Os produtos são originais?',
      answer: 'SIM! Somos revendedores autorizados O Boticário. Todos os produtos são 100% originais, lacrados e com garantia de qualidade. Você pode verificar a autenticidade pelo código do produto.'
    },
    {
      question: '💳 Como funciona o pagamento via Pix?',
      answer: 'Após finalizar o pedido, você recebe um QR Code Pix na tela. É só escanear com o app do seu banco ou copiar o código Pix. O pagamento é instantâneo e seu pedido é processado automaticamente!'
    },
    {
      question: '🔄 Posso trocar se não gostar?',
      answer: 'Sim! Você tem 30 dias para trocar qualquer produto. Se não gostar ou vier com defeito, fazemos a troca sem custo adicional. Basta entrar em contato pelo WhatsApp.'
    },
    {
      question: '🎁 Os descontos são reais?',
      answer: 'SIM! Todos os descontos exibidos são reais e já aplicados nos preços. Você vê o preço original riscado e o desconto de até 70% OFF. Não precisa de cupom, é só adicionar ao carrinho!'
    },
    {
      question: '📦 Como acompanho meu pedido?',
      answer: 'Após a confirmação do pagamento, você recebe um código de rastreamento por email em até 24 horas. Com ele, você acompanha seu pedido em tempo real nos Correios.'
    },
    {
      question: '🛡️ A compra é segura?',
      answer: 'Totalmente segura! Usamos Pix, que é o método de pagamento mais seguro do Brasil. Seus dados são protegidos e não armazenamos informações de pagamento. Além disso, somos revendedores autorizados.'
    },
    {
      question: '💬 Como entro em contato?',
      answer: 'Você pode falar conosco pelo WhatsApp clicando no botão verde flutuante no canto da tela. Respondemos rapidamente e tiramos todas suas dúvidas! Horário de atendimento: Seg-Sex 9h-18h, Sáb 9h-13h.'
    },
    {
      question: '🎯 Posso comprar vários produtos?',
      answer: 'Sim! Você pode adicionar quantos produtos quiser ao carrinho. Todos os descontos já estão aplicados e o frete continua grátis. Quanto mais comprar, mais economiza!'
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-bold mb-4">
            ❓ PERGUNTAS FREQUENTES
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Dúvidas? A Gente Responde!
          </h2>
          <p className="text-gray-600 text-lg">
            Confira as perguntas mais comuns dos nossos clientes
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="mb-4 animate-fadeIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className={`w-full text-left bg-white border-2 rounded-xl p-5 transition-all duration-300 ${
                  openIndex === index
                    ? 'border-primary-500 shadow-lg'
                    : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-bold text-gray-900 flex-1">
                    {faq.question}
                  </h3>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      openIndex === index
                        ? 'bg-primary-500 text-white rotate-180'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96 mt-4' : 'max-h-0'
                  }`}
                >
                  <p className="text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.answer}
                  </p>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Ainda tem dúvidas?</p>
          <a
            href="https://wa.me/5511951947983?text=Olá! Tenho uma dúvida sobre os produtos"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Fale Conosco no WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

export default FAQ
