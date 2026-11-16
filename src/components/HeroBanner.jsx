import { Link } from 'react-router-dom'

const HeroBanner = () => {
  return (
    <section className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #fbbf24 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* Left Content */}
          <div className="animate-slideInLeft">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              🖤 BLACK FRIDAY
              <span className="block text-yellow-400">O BOTICÁRIO</span>
            </h1>
            
            <p className="text-lg md:text-xl mb-6 text-gray-100">
              Os maiores descontos do ano! Produtos com até 75% OFF 🔥
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link 
                to="/produtos" 
                className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold text-base hover:bg-yellow-500 transform hover:scale-105 transition-all shadow-lg text-center"
              >
                Ver Ofertas Black Friday 🔥
              </Link>
              <Link 
                to="/produtos" 
                className="bg-white/20 backdrop-blur-sm border-2 border-yellow-400 text-white px-6 py-3 rounded-lg font-bold text-base hover:bg-white/30 transition-all text-center"
              >
                Todos os Produtos
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Produtos Originais</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
                <span>Frete Grátis</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
                <span>Descontos de até 75%</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden md:block animate-slideInRight">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-yellow-400">
                <div className="text-center">
                  <div className="text-8xl mb-4">🖤</div>
                  <p className="text-2xl font-bold mb-2">Produtos a partir de</p>
                  <p className="text-5xl font-bold text-yellow-400">R$ 24,90</p>
                  <p className="text-sm mt-2 text-gray-100">Black Friday | Frete Grátis 🚚</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  )
}
