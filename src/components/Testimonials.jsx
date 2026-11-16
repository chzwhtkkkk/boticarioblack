const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Maria Silva',
      location: 'São Paulo, SP',
      rating: 5,
      comment: 'Adorei! Os produtos chegaram super rápido e são originais. O Kit Liz é maravilhoso, o perfume dura o dia todo. Já comprei 3 vezes!',
      date: '2 dias atrás',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    {
      id: 2,
      name: 'Fernanda Oliveira',
      location: 'Campinas, SP',
      rating: 5,
      comment: 'Retirei na loja O Boticário em 3 horas! Muito prático, não precisei esperar a entrega. Comprei o Kit Elysée e já estava usando no mesmo dia. Adorei essa opção!',
      date: '1 dia atrás',
      avatar: 'https://i.pravatar.cc/150?img=25'
    },
    {
      id: 3,
      name: 'João Santos',
      location: 'Rio de Janeiro, RJ',
      rating: 5,
      comment: 'Comprei o Malbec e superou minhas expectativas. Preço ótimo, entrega rápida e produto original. Recomendo demais!',
      date: '1 semana atrás',
      avatar: 'https://i.pravatar.cc/150?img=12'
    },
    {
      id: 4,
      name: 'Ana Paula',
      location: 'Belo Horizonte, MG',
      rating: 5,
      comment: 'Melhor loja online! Atendimento pelo WhatsApp é excelente, tiraram todas minhas dúvidas. Os kits são perfeitos para presente!',
      date: '3 dias atrás',
      avatar: 'https://i.pravatar.cc/150?img=9'
    },
    {
      id: 5,
      name: 'Carlos Eduardo',
      location: 'Curitiba, PR',
      rating: 5,
      comment: 'Escolhi retirar na loja e em 3h já estava com meu pedido! Muito mais rápido que esperar entrega. Produtos de qualidade e preço justo. Já virei cliente fiel.',
      date: '5 dias atrás',
      avatar: 'https://i.pravatar.cc/150?img=33'
    },
    {
      id: 6,
      name: 'Juliana Costa',
      location: 'Brasília, DF',
      rating: 5,
      comment: 'Comprei o Kit Floratta Red para minha mãe e ela amou! Embalagem impecável, produtos originais. Voltarei a comprar com certeza!',
      date: '1 semana atrás',
      avatar: 'https://i.pravatar.cc/150?img=20'
    },
    {
      id: 7,
      name: 'Roberto Lima',
      location: 'Porto Alegre, RS',
      rating: 5,
      comment: 'Excelente experiência! Frete grátis, produtos originais e chegou antes do prazo. Nota 10!',
      date: '4 dias atrás',
      avatar: 'https://i.pravatar.cc/150?img=14'
    },
    {
      id: 8,
      name: 'Patrícia Mendes',
      location: 'Santos, SP',
      rating: 5,
      comment: 'A opção de retirar na loja em 3h é perfeita! Comprei de manhã e busquei na hora do almoço. Super prático e grátis. Recomendo!',
      date: '2 dias atrás',
      avatar: 'https://i.pravatar.cc/150?img=47'
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-bold mb-4">
            ⭐ DEPOIMENTOS
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-gray-600 text-lg">
            Mais de 1.000 clientes satisfeitos em todo Brasil! 💚
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-700 mb-4 leading-relaxed">
                "{testimonial.comment}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=a855f7&color=fff&size=128`
                  }}
                />
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
                <div className="text-xs text-gray-400">
                  {testimonial.date}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center items-center gap-8 pt-8 border-t border-purple-200">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">1.000+</p>
            <p className="text-gray-600 text-sm">Clientes Satisfeitos</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">4.9/5</p>
            <p className="text-gray-600 text-sm">Avaliação Média</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">98%</p>
            <p className="text-gray-600 text-sm">Recomendariam</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">100%</p>
            <p className="text-gray-600 text-sm">Produtos Originais</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
