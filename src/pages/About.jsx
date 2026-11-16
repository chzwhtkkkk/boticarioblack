import { Link } from 'react-router-dom'

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Sobre Nós
            </h1>
            <p className="text-xl text-gray-600">
              Revendedor autorizado O Boticário
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
            {/* Quem Somos */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-3xl">🏪</span>
                Quem Somos
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Somos revendedores autorizados O Boticário, trazendo para você os melhores produtos de beleza e perfumaria com preços especiais e condições exclusivas. Nossa missão é democratizar o acesso aos produtos O Boticário, oferecendo kits promocionais e combos especiais que cabem no seu bolso.
              </p>
            </section>

            {/* Nossa História */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-3xl">📖</span>
                Nossa História
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Iniciamos nossa jornada com o objetivo de tornar os produtos O Boticário mais acessíveis para todos os brasileiros. Através de parcerias estratégicas e uma logística eficiente, conseguimos oferecer descontos de até 70% em produtos originais e de alta qualidade.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Hoje, atendemos clientes em todo o Brasil, com frete grátis e opção de retirada em lojas físicas O Boticário em todo o país.
              </p>
            </section>

            {/* Nossos Valores */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-3xl">💎</span>
                Nossos Valores
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                    <span>✅</span> Autenticidade
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Todos os produtos são 100% originais O Boticário, com garantia de procedência.
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <span>💰</span> Preço Justo
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Oferecemos os melhores preços do mercado, com descontos reais de até 70%.
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                    <span>🚚</span> Entrega Rápida
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Frete grátis para todo Brasil e opção de retirada em até 3 horas.
                  </p>
                </div>
                <div className="bg-pink-50 rounded-lg p-6">
                  <h3 className="font-bold text-pink-900 mb-2 flex items-center gap-2">
                    <span>🤝</span> Compromisso
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Atendimento humanizado e suporte em todas as etapas da sua compra.
                  </p>
                </div>
              </div>
            </section>

            {/* Por que escolher */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-3xl">⭐</span>
                Por Que Escolher Nossa Loja?
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                  <span className="text-gray-700">
                    <strong>Produtos Originais:</strong> Revendedor autorizado com produtos 100% originais O Boticário
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                  <span className="text-gray-700">
                    <strong>Frete Grátis:</strong> Entrega gratuita para todo o Brasil via Correios
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                  <span className="text-gray-700">
                    <strong>Retirada Rápida:</strong> Retire em qualquer loja O Boticário em até 3 horas
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                  <span className="text-gray-700">
                    <strong>Pagamento Seguro:</strong> Pagamento via PIX com aprovação instantânea
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                  <span className="text-gray-700">
                    <strong>Descontos Reais:</strong> Até 70% OFF em kits e combos especiais
                  </span>
                </li>
              </ul>
            </section>

            {/* CTA */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-4">
                Pronto para Economizar?
              </h3>
              <p className="mb-6 text-purple-100">
                Confira nossos kits promocionais e aproveite os melhores preços!
              </p>
              <Link
                to="/produtos"
                className="inline-block bg-white text-purple-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition"
              >
                Ver Produtos
              </Link>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center mt-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 font-medium transition"
            >
              ← Voltar para a Loja
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
