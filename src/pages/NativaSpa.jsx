import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'
import * as metaPixel from '../services/metaPixel'

const NativaSpa = () => {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [viewingCount, setViewingCount] = useState(87)

  // Filtrar apenas produtos Nativa SPA
  const nativaSpaProducts = products.filter(p => 
    p.name.includes('Nativa Spa') || 
    p.name.includes('Nativa SPA') ||
    p.brand === 'Nativa SPA'
  )

  useEffect(() => {
    // Simular contador de pessoas visualizando
    const interval = setInterval(() => {
      setViewingCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2
        const newCount = prev + change
        return Math.max(65, Math.min(120, newCount))
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleBuyNow = (product) => {
    // Rastrear clique
    metaPixel.trackAddToCart(product, 1)

    // Adicionar ao carrinho e ir direto pro checkout
    addToCart(product, 1)
    navigate('/checkout')
  }

  const handleViewProduct = (productId) => {
    navigate(`/produto/${productId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-block bg-yellow-400 text-gray-900 px-6 py-2 rounded-full font-bold text-sm mb-4 animate-bounce">
              🌿 LINHA NATIVA SPA
            </div>

            {/* Título */}
            <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
              Nativa SPA
              <span className="block text-yellow-300">Cuidado Natural 🌱</span>
            </h1>

            {/* Subtítulo */}
            <p className="text-2xl md:text-3xl mb-6 font-semibold">
              Óleos e Loções com Ingredientes da Amazônia
            </p>

            {/* Contador de pessoas */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-green-400 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-emerald-400 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-green-300 border-2 border-white"></div>
              </div>
              <span className="font-semibold">
                <span className="text-yellow-300 text-xl">{viewingCount}</span> pessoas estão vendo agora
              </span>
            </div>

            {/* CTA */}
            <button
              onClick={() => document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' })}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-12 py-5 rounded-full text-2xl font-black shadow-2xl transform hover:scale-105 transition-all"
            >
              VER PRODUTOS 🌿
            </button>

            {/* Benefícios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 text-sm">
              <div className="flex items-center justify-center gap-2">
                <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
                <span className="font-semibold">Frete Grátis</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
                <span className="font-semibold">100% Natural</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
                <span className="font-semibold">Vegano</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Produtos Section */}
      <div id="produtos" className="container mx-auto px-4 py-12">
        {/* Título da Seção */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            🌿 Produtos Nativa SPA
          </h2>
          <p className="text-xl text-gray-600">
            Cuidado natural com ingredientes da Amazônia
          </p>
        </div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {nativaSpaProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 border-4 border-green-200 hover:border-green-400"
            >
              {/* Badge de Desconto */}
              <div 
                className="relative cursor-pointer"
                onClick={() => handleViewProduct(product.id)}
              >
                {product.discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-black text-lg z-10 shadow-lg animate-pulse">
                    -{product.discount}% OFF
                  </div>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover hover:opacity-90 transition-opacity"
                />
              </div>

              <div className="p-6">
                {/* Nome */}
                <h3 
                  className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 min-h-[56px] cursor-pointer hover:text-green-600 transition-colors"
                  onClick={() => handleViewProduct(product.id)}
                >
                  {product.name}
                </h3>

                {/* Preços */}
                <div className="mb-4">
                  {/* Avaliação do Produto */}
                  {product.rating > 0 && (
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 font-semibold">{product.rating}</span>
                      <span className="text-xs text-gray-500">({product.reviews} avaliações)</span>
                    </div>
                  )}
                  
                  {product.originalPrice > product.price && (
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-gray-400 line-through text-lg">
                        R$ {product.originalPrice.toFixed(2)}
                      </span>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                        ECONOMIZE R$ {(product.originalPrice - product.price).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="text-4xl font-black text-green-600">
                    R$ {product.price.toFixed(2)}
                  </div>
                </div>

                {/* Benefícios */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                    </svg>
                    <span>Frete Grátis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                    </svg>
                    <span>Produto Original</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                    </svg>
                    <span>Vegano & Cruelty Free</span>
                  </div>
                </div>

                {/* Botão */}
                <button
                  onClick={() => handleBuyNow(product)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-xl font-black text-lg shadow-lg transform hover:scale-105 transition-all"
                >
                  COMPRAR AGORA 🛒
                </button>

                {/* Estoque */}
                {product.stock < 20 && (
                  <p className="text-center text-sm text-orange-600 font-semibold mt-3">
                    ⚡ Últimas {product.stock} unidades!
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefícios Nativa SPA */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-black text-center text-gray-900 mb-4">
              Por Que Escolher Nativa SPA? 🌿
            </h2>
            <p className="text-center text-xl text-gray-600 mb-12">
              Cuidado natural com ingredientes da Amazônia
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🌱</span>
                </div>
                <h3 className="font-bold text-lg mb-2">100% Vegano</h3>
                <p className="text-gray-600 text-sm">Produtos veganos e livres de crueldade animal</p>
              </div>
              
              <div className="text-center">
                <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🌿</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Ingredientes Naturais</h3>
                <p className="text-gray-600 text-sm">Alta concentração de ingredientes da Amazônia</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">💧</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Hidratação Intensa</h3>
                <p className="text-gray-600 text-sm">Hidratação profunda e duradoura por até 24h</p>
              </div>
              
              <div className="text-center">
                <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">✨</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Fragrâncias Únicas</h3>
                <p className="text-gray-600 text-sm">Perfumação sofisticada e marcante</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NativaSpa
