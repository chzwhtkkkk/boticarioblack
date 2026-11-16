import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'
import CountdownTimer from '../components/CountdownTimer'
import * as metaPixel from '../services/metaPixel'

const PromoKits = () => {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [viewingCount, setViewingCount] = useState(127)

  // Filtrar todos os produtos da categoria "Kits e Presentes"
  const kits = products.filter(p => p.category === 'Kits e Presentes')

  useEffect(() => {
    // Simular contador de pessoas visualizando
    const interval = setInterval(() => {
      setViewingCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2
        const newCount = prev + change
        return Math.max(95, Math.min(150, newCount))
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-block bg-yellow-400 text-gray-900 px-6 py-2 rounded-full font-bold text-sm mb-4 animate-bounce">
              🔥 PROMOÇÃO RELÂMPAGO
            </div>

            {/* Título */}
            <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
              Kits Dia das Mães
              <span className="block text-yellow-300">ATÉ 40% OFF! 🎁</span>
            </h1>

            {/* Subtítulo */}
            <p className="text-2xl md:text-3xl mb-6 font-semibold">
              Presenteie quem você ama com O Boticário
            </p>

            {/* Contador de pessoas */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-pink-400 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-purple-400 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-pink-300 border-2 border-white"></div>
              </div>
              <span className="font-semibold">
                <span className="text-yellow-300 text-xl">{viewingCount}</span> pessoas estão vendo agora
              </span>
            </div>

            {/* Countdown Timer */}
            <div className="mb-6">
              <p className="text-lg mb-2 font-semibold">⏰ Promoção termina em:</p>
              <CountdownTimer />
            </div>

            {/* CTA */}
            <button
              onClick={() => document.getElementById('kits').scrollIntoView({ behavior: 'smooth' })}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-12 py-5 rounded-full text-2xl font-black shadow-2xl transform hover:scale-105 transition-all"
            >
              VER KITS EM PROMOÇÃO 🎁
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
                <span className="font-semibold">Pagamento Seguro</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
                <span className="font-semibold">Entrega Rápida</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kits Section */}
      <div id="kits" className="container mx-auto px-4 py-12">
        {/* Título da Seção */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            🎁 Kits em Promoção
          </h2>
          <p className="text-xl text-gray-600">
            Escolha o kit perfeito para presentear
          </p>
          {/* Avaliação Geral */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-700 font-semibold">4.9/5.0</span>
            <span className="text-gray-500">(2.847 avaliações)</span>
          </div>
        </div>

        {/* Grid de Kits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {kits.map((kit) => (
            <div
              key={kit.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 border-4 border-pink-200 hover:border-pink-400"
            >
              {/* Badge de Desconto */}
              <div 
                className="relative cursor-pointer"
                onClick={() => handleViewProduct(kit.id)}
              >
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-black text-lg z-10 shadow-lg animate-pulse">
                  -25% OFF
                </div>
                <img
                  src={kit.image}
                  alt={kit.name}
                  className="w-full h-64 object-cover hover:opacity-90 transition-opacity"
                />
              </div>

              <div className="p-6">
                {/* Nome */}
                <h3 
                  className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 min-h-[56px] cursor-pointer hover:text-pink-600 transition-colors"
                  onClick={() => handleViewProduct(kit.id)}
                >
                  {kit.name}
                </h3>

                {/* Preços */}
                <div className="mb-4">
                  {/* Avaliação do Produto */}
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 font-semibold">4.9</span>
                    <span className="text-xs text-gray-500">({Math.floor(Math.random() * 300) + 150} avaliações)</span>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-gray-400 line-through text-lg">
                      R$ {(kit.price * 1.33).toFixed(2)}
                    </span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                      ECONOMIZE R$ {(kit.price * 0.33).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-4xl font-black text-pink-600">
                    R$ {kit.price.toFixed(2)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    ou 3x de R$ {(kit.price / 3).toFixed(2)} sem juros
                  </p>
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
                    <span>Entrega em 7-13 dias</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                    </svg>
                    <span>Produto Original</span>
                  </div>
                </div>

                {/* Botão */}
                <button
                  onClick={() => handleBuyNow(kit)}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-4 rounded-xl font-black text-lg shadow-lg transform hover:scale-105 transition-all"
                >
                  COMPRAR AGORA 🛒
                </button>

                {/* Urgência */}
                <p className="text-center text-sm text-orange-600 font-semibold mt-3">
                  ⚡ Últimas {Math.floor(Math.random() * 8) + 3} unidades!
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Por Que Escolher Nossos Kits */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-black text-center text-gray-900 mb-4">
              Por Que Escolher Nossos Kits? 💝
            </h2>
            <p className="text-center text-xl text-gray-600 mb-12">
              Mais de 10.000 mães já foram presenteadas
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">100% Original</h3>
                <p className="text-gray-600 text-sm">Produtos autênticos O Boticário com garantia de procedência</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Embalagem Especial</h3>
                <p className="text-gray-600 text-sm">Kits lindamente embalados, prontos para presentear</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Entrega Rápida</h3>
                <p className="text-gray-600 text-sm">Receba em 7-13 dias úteis com rastreamento</p>
              </div>
              
              <div className="text-center">
                <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Melhor Preço</h3>
                <p className="text-gray-600 text-sm">Até 40% OFF + Frete Grátis em todos os kits</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Depoimentos */}
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-black text-center text-gray-900 mb-4">
              O Que Nossas Clientes Dizem ❤️
            </h2>
            <p className="text-center text-xl text-gray-600 mb-12">
              Mais de 2.800 avaliações positivas
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Depoimento 1 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Comprei o Kit Floratta Red para minha mãe e ela AMOU! Chegou super rápido, bem embalado e o perfume é maravilhoso. Melhor presente do Dia das Mães! 💕"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center font-bold text-pink-700">
                    MC
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Maria Clara</p>
                    <p className="text-sm text-gray-500">São Paulo, SP</p>
                  </div>
                </div>
              </div>

              {/* Depoimento 2 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Produtos originais, preço excelente e entrega no prazo! Já é a terceira vez que compro aqui. Super recomendo! 🌟"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center font-bold text-purple-700">
                    JS
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Juliana Santos</p>
                    <p className="text-sm text-gray-500">Rio de Janeiro, RJ</p>
                  </div>
                </div>
              </div>

              {/* Depoimento 3 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Atendimento impecável! Tirou todas minhas dúvidas pelo WhatsApp e o kit chegou perfeito. Minha sogra ficou emocionada! 😍"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center font-bold text-green-700">
                    RA
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Rafaela Alves</p>
                    <p className="text-sm text-gray-500">Belo Horizonte, MG</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Prova Social */}
            <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <p className="text-4xl font-black text-pink-600 mb-2">10.000+</p>
                  <p className="text-gray-600 font-semibold">Kits Vendidos</p>
                </div>
                <div>
                  <p className="text-4xl font-black text-purple-600 mb-2">4.9/5.0</p>
                  <p className="text-gray-600 font-semibold">Avaliação Média</p>
                </div>
                <div>
                  <p className="text-4xl font-black text-green-600 mb-2">98%</p>
                  <p className="text-gray-600 font-semibold">Satisfação</p>
                </div>
                <div>
                  <p className="text-4xl font-black text-yellow-600 mb-2">2.847</p>
                  <p className="text-gray-600 font-semibold">Avaliações</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* O Que Vem no Kit */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-black text-center text-gray-900 mb-4">
              O Que Vem em Cada Kit? 📦
            </h2>
            <p className="text-center text-xl text-gray-600 mb-12">
              Kits completos com produtos selecionados
            </p>
            
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="bg-pink-500 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Perfume ou Colônia</h3>
                    <p className="text-gray-600">Fragrância exclusiva O Boticário, 75ml ou 100ml</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Hidratante Corporal</h3>
                    <p className="text-gray-600">Loção hidratante perfumada, 200ml ou 250ml</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-pink-500 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Sabonete Líquido</h3>
                    <p className="text-gray-600">Sabonete líquido perfumado para banho, 200ml</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Embalagem Presente</h3>
                    <p className="text-gray-600">Caixa especial Dia das Mães, pronta para presentear</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-white rounded-xl p-6 border-2 border-pink-200">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-8 h-8 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <h3 className="font-bold text-xl">Bônus Exclusivo!</h3>
                </div>
                <p className="text-gray-700">
                  <strong>Cartão personalizado GRÁTIS</strong> para você escrever sua mensagem especial para sua mãe! 💌
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Garantia Section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white text-green-600 rounded-full p-6 mb-6">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-4xl font-black mb-4">
              Compra 100% Segura e Garantida
            </h2>
            <p className="text-xl mb-6">
              Produtos originais O Boticário com garantia de qualidade
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl mb-3">🔒</div>
                <h3 className="font-bold text-lg mb-2">Pagamento Seguro</h3>
                <p className="text-sm">Seus dados protegidos</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl mb-3">📦</div>
                <h3 className="font-bold text-lg mb-2">Entrega Garantida</h3>
                <p className="text-sm">Rastreamento em tempo real</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl mb-3">✨</div>
                <h3 className="font-bold text-lg mb-2">Produto Original</h3>
                <p className="text-sm">Direto da revenda oficial</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Não Perca Esta Oportunidade! 🎁
          </h2>
          <p className="text-2xl mb-8">
            Promoção por tempo limitado
          </p>
          <button
            onClick={() => document.getElementById('kits').scrollIntoView({ behavior: 'smooth' })}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-12 py-5 rounded-full text-2xl font-black shadow-2xl transform hover:scale-105 transition-all inline-block"
          >
            ESCOLHER MEU KIT AGORA 🚀
          </button>
        </div>
      </div>
    </div>
  )
}

export default PromoKits
