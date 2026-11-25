import { Link } from 'react-router-dom'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'
import { useState, useEffect } from 'react'

const Home = () => {
  const kits = products.filter(p => p.category === 'Kits e Presentes')
  const nonKitProducts = products.filter(p => p.category !== 'Kits e Presentes')
  const bestSellers = products.filter(p => p.bestSeller)
  const perfumes = products.filter(p => p.category.includes('Perfumes'))
  
  // Novos produtos Black Friday 2024 (IDs 58-79) - reutilizando os produtos existentes
  const blackFridayProductsRaw = products.filter(p => p.id >= 58 && p.id <= 79)
  
  // Produtos Natal 2026 (IDs 80-84)
  const natalProducts = products.filter(p => p.id >= 80 && p.id <= 84)
  
  // Ordem específica dos produtos mais vendidos
  const blackFridayOrder = [61, 64, 62, 65, 76, 59, 77, 66, 67, 40] // Her Code, Malbec X, Floratta Red, Lily, Arabian Oasis, Coffee Woman, Egeo Dolce, Quasar Vision, Egeo Bomb, Malbec X Kit
  
  const blackFridayProducts = blackFridayOrder
    .map(id => products.find(p => p.id === id))
    .filter(p => p !== undefined)
    .concat(blackFridayProductsRaw.filter(p => !blackFridayOrder.includes(p.id))) // Adiciona os demais produtos que não estão na ordem específica
  
  
  const [showAllPerfumes, setShowAllPerfumes] = useState(false)
  const [showAllBlackFriday, setShowAllBlackFriday] = useState(false)
  const [showAllOtherKits, setShowAllOtherKits] = useState(false)
  const [showAllNatal, setShowAllNatal] = useState(false)
  const displayedPerfumes = showAllPerfumes ? perfumes : perfumes.slice(0, 4)

  // Estado do carrossel de banners
  const [currentBanner, setCurrentBanner] = useState(0)
  const banners = [
    '/images/black26/56bcde36-ab8e-47e2-b628-6dfbc9824107-billboard-desk-26c16-qdb-beauty-november-2.webp',
    '/images/black26/89e5bda4-2d2b-4207-ac0f-a02bfead2e81-billboard-desk-26c16-reversao-brinde-cbem-1.webp',
    '/images/black26/f08aeb22-5c09-4af0-bfa1-2c1052c223db-billboard-desk-26c16-bn-corpo-banho.webp',
  ]

  // Auto-play do carrossel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [banners.length])

  return (
    <div className="bg-white">
      {/* TOP BANNER - Elegante */}
      <div className="bg-black text-white py-2.5">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs md:text-sm font-medium">
            BLACK FRIDAY | Descontos de até 75% + Frete Grátis para todo o Brasil
          </p>
        </div>
      </div>

      {/* CARROSSEL DE BANNERS PRINCIPAL */}
      <section className="mb-8 relative">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-lg">
            {/* Banners */}
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentBanner * 100}%)` }}
            >
              {banners.map((banner, index) => (
                <div key={index} className="min-w-full">
                  <img 
                    src={banner}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-auto -mt-[45%]"
                  />
                </div>
              ))}
            </div>

            {/* Botão Aproveite - Minimalista */}
            <button
              onClick={() => {
                document.getElementById('kits')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-md shadow-lg transition-all"
            >
              Ver ofertas
            </button>

            {/* Setas de Navegação */}
            <button
              onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-colors"
            >
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-colors"
            >
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Indicadores */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBanner(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentBanner ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* KITS BLACK FRIDAY - Clean */}
      <section id="kits" className="py-8">
        <div className="container mx-auto px-4">
          {/* Imagem de Apresentação - Clicável */}
          <div className="mb-8 cursor-pointer" onClick={() => {
            document.getElementById('produtos-promocao')?.scrollIntoView({ behavior: 'smooth' })
          }}>
            <img 
              src="/images/foto site.png"
              alt="Black Friday O Boticário - Clique para ver as ofertas"
              className="w-full max-w-6xl mx-auto rounded-lg shadow-md hover:shadow-xl transition-shadow"
            />
          </div>

          {/* Título Simples e Elegante */}
          <div id="produtos-promocao" className="mb-6">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">
              Kits e Presentes
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              Descontos de até 75% em kits exclusivos
            </p>
          </div>

          {/* Grid de Produtos BLACK FRIDAY 2024 - 2 colunas no mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {blackFridayProducts.slice(0, showAllBlackFriday ? blackFridayProducts.length : 10).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Ver Mais / Ver produtos */}
          <div className="text-center mt-4">
            {!showAllBlackFriday && blackFridayProducts.length > 10 ? (
              <button 
                onClick={() => setShowAllBlackFriday(true)}
                className="inline-flex items-center gap-2 text-black font-medium hover:underline"
              >
                Ver Mais Ofertas
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            ) : (
              <Link 
                to="/produtos" 
                className="inline-flex items-center gap-2 text-black font-medium hover:underline"
              >
                Ver todos os produtos
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* KITS NATAL 2026 - NOVA SEÇÃO */}
      <section className="py-6 md:py-8 bg-gradient-to-br from-red-50 via-green-50 to-red-50">
        <div className="container mx-auto px-4">
          {/* Título com Veja Mais */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              🎄 NATAL 2026 | Presentes Especiais para Quem Você Ama
            </h2>
            <Link to="/produtos" className="text-sm text-gray-600 hover:text-red-700 flex items-center gap-1">
              Veja Mais
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Badge Especial Natal */}
          <div className="mb-4 text-center">
            <span className="inline-block bg-gradient-to-r from-red-600 to-green-600 text-white px-6 py-2 rounded-full font-bold text-sm animate-pulse">
              ✨ Lançamento Natal 2026 | Até 81% OFF
            </span>
          </div>

          {/* Grid de Produtos NATAL 2026 - 2 colunas no mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {natalProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Ver produtos link */}
          <div className="text-center mt-4">
            <Link 
              to="/produtos" 
              className="inline-flex items-center gap-2 text-red-700 font-medium hover:underline"
            >
              Ver todos os produtos de Natal
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* KITS ANTIGOS - Outros Kits */}
      <section className="py-6 md:py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Título com Veja Mais */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              Mais Kits e Presentes
            </h2>
            <Link to="/produtos" className="text-sm text-gray-600 hover:text-black flex items-center gap-1">
              Veja Mais
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Grid de Produtos Antigos - 2 colunas no mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {kits.filter(p => p.id < 58).slice(0, showAllOtherKits ? kits.filter(p => p.id < 58).length : 10).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Ver Mais / Ver produtos */}
          <div className="text-center mt-4">
            {!showAllOtherKits && kits.filter(p => p.id < 58).length > 10 ? (
              <button 
                onClick={() => setShowAllOtherKits(true)}
                className="inline-flex items-center gap-2 text-black font-medium hover:underline"
              >
                Ver Mais Kits
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            ) : (
              <Link 
                to="/produtos" 
                className="inline-flex items-center gap-2 text-black font-medium hover:underline"
              >
                Ver todos os produtos
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* SEÇÃO RELÂMPAGO: BLACK FRIDAY */}
      <section className="py-6 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Título com Veja Mais */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              ⚡ Ofertas Relâmpago Black Friday
            </h2>
            <Link to="/produtos" className="text-sm text-gray-600 hover:text-black flex items-center gap-1">
              Veja Mais
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Grid de Produtos - 2 colunas no mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {perfumes.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Ver produtos link */}
          <div className="text-center mt-4">
            <Link 
              to="/produtos" 
              className="inline-flex items-center gap-2 text-black font-medium hover:underline"
            >
              Ver produtos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* BANNER LILY LOVERS */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="overflow-hidden rounded-lg" style={{ maxHeight: '600px' }}>
            <img 
              src="/images/boti/8756931b-9939-4985-98f7-cdc92a0e6af3-26c08-lily-lovers-billboard-mob-1080x1641.avif"
              alt="Lily Lovers"
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center 40%' }}
            />
          </div>
        </div>
      </section>

      {/* PERFUMES SECTION */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          {/* Banner Perfumaria 35% OFF */}
          <div className="mb-4 overflow-hidden rounded-lg" style={{ maxHeight: '600px' }}>
            <img 
              src="/images/boti/77eb309c-2ce9-45be-9252-761f7b3c088f-26c08-perfumaria-bodysplash-35off-billboard-mob-1080x1641.avif"
              alt="Perfumaria 35% OFF"
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center 40%' }}
            />
          </div>

          {/* Título com Veja Mais */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              Perfumaria
            </h2>
            <Link to="/produtos" className="text-sm text-gray-600 hover:text-black flex items-center gap-1">
              Veja Mais
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Grid de Produtos - 2 colunas no mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {displayedPerfumes.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Ver produtos link */}
          <div className="text-center mt-4">
            <Link 
              to="/produtos" 
              className="inline-flex items-center gap-2 text-black font-medium hover:underline"
            >
              Ver produtos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* BANNER NATIVA SPA */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="overflow-hidden rounded-lg" style={{ maxHeight: '600px' }}>
            <img 
              src="/images/boti/866f29f0-1dac-4d50-93f9-984a6e4ff992-nspa-baunilha-exclusive-26c08-billboard-mob-1080x1641.avif"
              alt="Nativa SPA Baunilha Exclusive"
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center 40%' }}
            />
          </div>
        </div>
      </section>

      {/* TODOS OS PRODUTOS */}
      <section className="py-6 md:py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Título com Veja Mais */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              Todos os Produtos
            </h2>
            <Link to="/produtos" className="text-sm text-gray-600 hover:text-black flex items-center gap-1">
              Veja Mais
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Grid de Produtos - 2 colunas no mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {nonKitProducts.slice(0, 10).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Ver produtos link */}
          <div className="text-center mt-4">
            <Link 
              to="/produtos" 
              className="inline-flex items-center gap-2 text-black font-medium hover:underline"
            >
              Ver produtos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Links Úteis, Pagamento e Segurança */}
      <div className="bg-white py-12 border-t border-gray-200">
        <div className="container mx-auto px-4">
          {/* Links Úteis */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Links Úteis</h2>
            <div className="max-w-2xl mx-auto space-y-3">
              <details className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition">
                  <span className="text-lg text-gray-700 font-medium">Dúvidas</span>
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                    Entre em contato conosco através do WhatsApp ou e-mail para esclarecer suas dúvidas sobre produtos, pedidos e entregas.
                  </p>
                </div>
              </details>

              <details className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition">
                  <span className="text-lg text-gray-700 font-medium">Marcas</span>
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                    Trabalhamos exclusivamente com produtos originais O Boticário: Malbec, Lily, Floratta, Egeo, Nativa SPA, Cuide-se Bem e muito mais.
                  </p>
                </div>
              </details>

              <details className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition">
                  <span className="text-lg text-gray-700 font-medium">Institucional</span>
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                    Somos revendedores autorizados O Boticário. Todos os produtos são 100% originais com garantia de qualidade e procedência.
                  </p>
                </div>
              </details>
            </div>
          </div>

          {/* Pagamento */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Pagamento</h2>
            <div className="max-w-3xl mx-auto bg-gray-50 rounded-lg border border-gray-200 p-6">
              <img 
                src="/images/black26/792b7f0e-e1cc-4c68-8c0a-d02626441d1a-pagamentos.webp"
                alt="Formas de Pagamento"
                className="w-full max-w-md mx-auto mb-4"
              />
              <p className="text-center text-gray-600 text-sm">
                Até 10x sem juros no cartão. Confira as regras
              </p>
            </div>
          </div>

          {/* Segurança */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Segurança</h2>
            <div className="max-w-3xl mx-auto bg-gray-50 rounded-lg border border-gray-200 p-6">
              <img 
                src="/images/black26/9d9f5d9c-4742-435b-aa58-729b120e2003-seguranca.webp"
                alt="Segurança"
                className="w-full max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Home
