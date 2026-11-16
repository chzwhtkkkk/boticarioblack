import { Link } from 'react-router-dom'
import { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aqui você pode integrar com um serviço de email
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Entre em Contato
            </h1>
            <p className="text-xl text-gray-600">
              Estamos aqui para ajudar! Envie sua mensagem e responderemos em breve.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Formulário */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Envie uma Mensagem
              </h2>
              
              {submitted ? (
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 text-center">
                  <div className="text-green-600 text-5xl mb-4">✓</div>
                  <h3 className="text-xl font-bold text-green-900 mb-2">
                    Mensagem Enviada!
                  </h3>
                  <p className="text-green-700">
                    Obrigado pelo contato. Responderemos em breve!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Seu nome"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Assunto *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="pedido">Dúvidas sobre Pedido</option>
                      <option value="produto">Informações sobre Produto</option>
                      <option value="entrega">Rastreamento de Entrega</option>
                      <option value="troca">Trocas e Devoluções</option>
                      <option value="pagamento">Problemas com Pagamento</option>
                      <option value="outro">Outro Assunto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Mensagem *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      placeholder="Descreva sua dúvida ou mensagem..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition"
                  >
                    Enviar Mensagem
                  </button>
                </form>
              )}
            </div>

            {/* Informações de Contato */}
            <div className="space-y-6">
              {/* Canais de Atendimento */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Canais de Atendimento
                </h2>
                
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 rounded-full p-3 flex-shrink-0">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">E-mail</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        Resposta em até 24 horas
                      </p>
                      <a href="mailto:contato@oboticario-revendas.com.br" className="text-purple-600 hover:text-purple-700 font-medium">
                        contato@oboticario-revendas.com.br
                      </a>
                    </div>
                  </div>

                  {/* Telefone */}
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 rounded-full p-3 flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Telefone</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        Seg a Sex: 9h às 18h
                      </p>
                      <a href="tel:+5543999999999" className="text-green-600 hover:text-green-700 font-medium">
                        (43) 99999-9999
                      </a>
                    </div>
                  </div>

                  {/* Horário */}
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Horário de Atendimento</h3>
                      <p className="text-gray-600 text-sm">
                        Segunda a Sexta: 9h às 18h<br/>
                        Sábado: 9h às 13h<br/>
                        Domingo: Fechado
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Rápido */}
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">
                  Perguntas Frequentes
                </h2>
                <p className="mb-6 text-purple-100">
                  Antes de entrar em contato, confira se sua dúvida já está respondida em nossa página de FAQ.
                </p>
                <Link
                  to="/"
                  className="inline-block bg-white text-purple-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition"
                >
                  Ver FAQ
                </Link>
              </div>
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

export default Contact
