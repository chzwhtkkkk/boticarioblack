import { Link } from 'react-router-dom'

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Política de Privacidade
            </h1>
            <p className="text-gray-600">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
            {/* Introdução */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Introdução
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você utiliza nosso site e serviços. Ao utilizar nossos serviços, você concorda com as práticas descritas nesta política.
              </p>
            </section>

            {/* Informações Coletadas */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Informações que Coletamos
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">2.1. Informações Fornecidas por Você</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Nome completo</li>
                    <li>Endereço de e-mail</li>
                    <li>Número de telefone</li>
                    <li>CPF</li>
                    <li>Endereço de entrega</li>
                    <li>Informações de pagamento (processadas por gateway seguro)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">2.2. Informações Coletadas Automaticamente</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Endereço IP</li>
                    <li>Tipo de navegador e dispositivo</li>
                    <li>Páginas visitadas e tempo de navegação</li>
                    <li>Cookies e tecnologias similares</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Como Usamos */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Como Usamos Suas Informações
              </h2>
              <p className="text-gray-700 mb-4">Utilizamos suas informações para:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Processar e entregar seus pedidos</li>
                <li>Enviar confirmações e atualizações sobre seu pedido</li>
                <li>Melhorar nossos produtos e serviços</li>
                <li>Personalizar sua experiência de compra</li>
                <li>Enviar ofertas e promoções (com seu consentimento)</li>
                <li>Prevenir fraudes e garantir a segurança</li>
                <li>Cumprir obrigações legais</li>
              </ul>
            </section>

            {/* Compartilhamento */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Compartilhamento de Informações
              </h2>
              <p className="text-gray-700 mb-4">
                Não vendemos suas informações pessoais. Podemos compartilhar seus dados apenas com:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Prestadores de Serviço:</strong> Empresas que nos ajudam a processar pagamentos, enviar produtos e fornecer suporte</li>
                <li><strong>Parceiros de Entrega:</strong> Correios e transportadoras para entrega dos produtos</li>
                <li><strong>Autoridades Legais:</strong> Quando exigido por lei ou para proteger nossos direitos</li>
              </ul>
            </section>

            {/* Segurança */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Segurança dos Dados
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. Utilizamos criptografia SSL/TLS para proteger dados sensíveis durante a transmissão e armazenamos informações em servidores seguros.
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Cookies e Tecnologias Similares
              </h2>
              <p className="text-gray-700 mb-4">
                Utilizamos cookies para melhorar sua experiência de navegação. Cookies são pequenos arquivos de texto armazenados em seu dispositivo que nos ajudam a:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Lembrar suas preferências</li>
                <li>Manter você conectado</li>
                <li>Analisar o tráfego do site</li>
                <li>Personalizar conteúdo e anúncios</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Você pode configurar seu navegador para recusar cookies, mas isso pode afetar a funcionalidade do site.
              </p>
            </section>

            {/* Seus Direitos */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Seus Direitos (LGPD)
              </h2>
              <p className="text-gray-700 mb-4">
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Confirmar a existência de tratamento de dados</li>
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                <li>Solicitar a anonimização, bloqueio ou eliminação de dados</li>
                <li>Solicitar a portabilidade dos dados</li>
                <li>Revogar o consentimento</li>
                <li>Opor-se ao tratamento de dados</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Para exercer seus direitos, entre em contato conosco através dos canais disponíveis no site.
              </p>
            </section>

            {/* Retenção */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Retenção de Dados
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir as finalidades descritas nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei.
              </p>
            </section>

            {/* Menores */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Privacidade de Menores
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Nossos serviços não são direcionados a menores de 18 anos. Não coletamos intencionalmente informações pessoais de menores. Se você é pai ou responsável e acredita que seu filho nos forneceu informações pessoais, entre em contato conosco.
              </p>
            </section>

            {/* Alterações */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Alterações nesta Política
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre alterações significativas publicando a nova política em nosso site com uma nova data de "última atualização".
              </p>
            </section>

            {/* Contato */}
            <section className="bg-purple-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Contato
              </h2>
              <p className="text-gray-700 mb-4">
                Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos seus dados pessoais, entre em contato conosco:
              </p>
              <div className="text-gray-700 space-y-2">
                <p><strong>E-mail:</strong> privacidade@oboticario-revendas.com.br</p>
                <p><strong>Telefone:</strong> (43) 99999-9999</p>
              </div>
            </section>
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

export default Privacy
