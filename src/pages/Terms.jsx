import { Link } from 'react-router-dom'

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Termos de Uso
            </h1>
            <p className="text-gray-600">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
            {/* Aceitação */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Aceitação dos Termos
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Ao acessar e usar este site, você aceita e concorda em cumprir estes Termos de Uso e todas as leis e regulamentos aplicáveis. Se você não concordar com algum destes termos, está proibido de usar ou acessar este site.
              </p>
            </section>

            {/* Uso do Site */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Uso do Site
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">2.1. Licença de Uso</h3>
                  <p className="text-gray-700">
                    É concedida permissão para visualizar e usar temporariamente o conteúdo deste site apenas para uso pessoal e não comercial.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">2.2. Restrições</h3>
                  <p className="text-gray-700 mb-2">Você não pode:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Modificar ou copiar os materiais do site</li>
                    <li>Usar os materiais para fins comerciais</li>
                    <li>Tentar descompilar ou fazer engenharia reversa</li>
                    <li>Remover direitos autorais ou notações proprietárias</li>
                    <li>Transferir os materiais para outra pessoa</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Cadastro */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Cadastro e Conta
              </h2>
              <p className="text-gray-700 mb-4">
                Para realizar compras, você deve fornecer informações verdadeiras, precisas e completas. Você é responsável por:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Manter a confidencialidade de suas informações de conta</li>
                <li>Todas as atividades que ocorrem em sua conta</li>
                <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
              </ul>
            </section>

            {/* Produtos e Preços */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Produtos e Preços
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">4.1. Disponibilidade</h3>
                  <p className="text-gray-700">
                    Todos os produtos estão sujeitos à disponibilidade. Reservamo-nos o direito de limitar quantidades ou descontinuar produtos a qualquer momento.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">4.2. Preços</h3>
                  <p className="text-gray-700">
                    Os preços estão sujeitos a alterações sem aviso prévio. Nos reservamos o direito de corrigir erros de preço, mesmo após o pedido ter sido confirmado.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">4.3. Autenticidade</h3>
                  <p className="text-gray-700">
                    Todos os produtos vendidos são 100% originais O Boticário. Somos revendedores autorizados e garantimos a procedência de todos os itens.
                  </p>
                </div>
              </div>
            </section>

            {/* Pedidos */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Pedidos e Pagamento
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">5.1. Confirmação</h3>
                  <p className="text-gray-700">
                    Ao fazer um pedido, você receberá um e-mail de confirmação. A confirmação não significa aceitação do pedido, apenas que recebemos sua solicitação.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">5.2. Pagamento</h3>
                  <p className="text-gray-700">
                    Aceitamos pagamento via PIX. O pagamento deve ser realizado em até 15 minutos após a geração do código PIX. Após esse prazo, o pedido será cancelado automaticamente.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">5.3. Cancelamento</h3>
                  <p className="text-gray-700">
                    Reservamo-nos o direito de recusar ou cancelar qualquer pedido por motivos como: disponibilidade de produto, erros de preço, fraude ou outros problemas identificados.
                  </p>
                </div>
              </div>
            </section>

            {/* Entrega */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Entrega
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">6.1. Prazos</h3>
                  <p className="text-gray-700">
                    Os prazos de entrega são estimativas e podem variar. Não nos responsabilizamos por atrasos causados por transportadoras ou eventos fora do nosso controle.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">6.2. Frete Grátis</h3>
                  <p className="text-gray-700">
                    Oferecemos frete grátis via Correios para todo o Brasil. O prazo de entrega varia de 5 a 10 dias úteis.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">6.3. Retirada na Loja</h3>
                  <p className="text-gray-700">
                    Você pode optar por retirar seu pedido em qualquer loja O Boticário. Após a confirmação do pagamento, você receberá um e-mail em até 3 horas informando a loja mais próxima para retirada.
                  </p>
                </div>
              </div>
            </section>

            {/* Trocas e Devoluções */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Trocas e Devoluções
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">7.1. Direito de Arrependimento</h3>
                  <p className="text-gray-700">
                    Conforme o Código de Defesa do Consumidor, você tem até 7 dias corridos após o recebimento do produto para desistir da compra, sem necessidade de justificativa.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">7.2. Condições</h3>
                  <p className="text-gray-700 mb-2">Para trocas e devoluções, o produto deve estar:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Na embalagem original</li>
                    <li>Sem sinais de uso</li>
                    <li>Com todos os acessórios e manuais</li>
                    <li>Com nota fiscal</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">7.3. Produtos com Defeito</h3>
                  <p className="text-gray-700">
                    Produtos com defeito de fabricação serão trocados ou o valor será reembolsado integralmente, incluindo o frete.
                  </p>
                </div>
              </div>
            </section>

            {/* Propriedade Intelectual */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Propriedade Intelectual
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Todo o conteúdo deste site, incluindo textos, gráficos, logos, imagens e software, é propriedade de O Boticário ou de seus fornecedores de conteúdo e é protegido por leis de direitos autorais. A marca O Boticário é propriedade de Grupo Boticário.
              </p>
            </section>

            {/* Limitação de Responsabilidade */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Limitação de Responsabilidade
              </h2>
              <p className="text-gray-700 mb-4">
                Em nenhuma circunstância seremos responsáveis por:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Danos indiretos, incidentais ou consequenciais</li>
                <li>Perda de lucros ou dados</li>
                <li>Interrupção de negócios</li>
                <li>Problemas causados por terceiros (transportadoras, bancos, etc.)</li>
              </ul>
            </section>

            {/* Lei Aplicável */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Lei Aplicável
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Estes termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será resolvida nos tribunais brasileiros.
              </p>
            </section>

            {/* Alterações */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Alterações nos Termos
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação no site. O uso continuado do site após as alterações constitui aceitação dos novos termos.
              </p>
            </section>

            {/* Contato */}
            <section className="bg-purple-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                12. Contato
              </h2>
              <p className="text-gray-700 mb-4">
                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
              </p>
              <div className="text-gray-700 space-y-2">
                <p><strong>E-mail:</strong> contato@oboticario-revendas.com.br</p>
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

export default Terms
