import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { products } from '../data/products'
import { productDetails } from '../data/productDetails'
import { productGalleries } from '../data/productGalleries'
import { useCart } from '../context/CartContext'
import ProductGallery from '../components/ProductGallery'
import { trackViewContent, trackAddToCart } from '../services/utmify'
import * as metaPixel from '../services/metaPixel'
import { formatPrice } from '../utils/formatPrice'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [showMoreProducts, setShowMoreProducts] = useState(false)
  const [cep, setCep] = useState('')
  const [shippingInfo, setShippingInfo] = useState(null)

  const product = products.find(p => p.id === parseInt(id))
  const details = productDetails[parseInt(id)]
  const gallery = productGalleries[parseInt(id)]

  useEffect(() => {
    window.scrollTo(0, 0)
    if (product) {
      trackViewContent(product)
      metaPixel.trackViewContent(product)
    }
  }, [id])

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
        <button onClick={() => navigate('/produtos')} className="btn-primary">
          Ver Produtos
        </button>
      </div>
    )
  }

  const handleAddToCart = () => {
    trackAddToCart(product, quantity)
    metaPixel.trackAddToCart(product, quantity)
    addToCart(product, quantity)
    // Redireciona DIRETO pro checkout
    navigate('/checkout')
  }

  // Formata o CEP enquanto digita
  const formatCep = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 5) {
      return numbers
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
  }

  const handleCepChange = (e) => {
    const formatted = formatCep(e.target.value)
    setCep(formatted)
  }

  const handleCheckShipping = async () => {
    const cepNumbers = cep.replace(/\D/g, '')
    
    if (cepNumbers.length !== 8) {
      alert('Por favor, digite um CEP válido com 8 dígitos.')
      return
    }

    try {
      // Busca informações do CEP na API ViaCEP
      const response = await fetch(`https://viacep.com.br/ws/${cepNumbers}/json/`)
      const data = await response.json()

      if (data.erro) {
        alert('CEP não encontrado. Por favor, verifique e tente novamente.')
        return
      }

      // Retorna frete grátis com o nome da cidade
      setShippingInfo({
        freeShipping: true,
        deliveryTime: '3-13 dias úteis',
        city: data.localidade,
        state: data.uf
      })
    } catch (error) {
      alert('Erro ao consultar CEP. Tente novamente.')
    }
  }

  const handleNotKnowCep = () => {
    window.open('https://buscacepinter.correios.com.br/app/endereco/index.php', '_blank')
  }

  // Produtos aleatórios de todo o site (exceto o produto atual)
  const allOtherProducts = products.filter(p => p.id !== product.id)
  const shuffledProducts = [...allOtherProducts].sort(() => Math.random() - 0.5)
  const displayedProducts = showMoreProducts ? shuffledProducts.slice(0, 12) : shuffledProducts.slice(0, 4)

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  // Produtos para "Compre Junto" - 2 produtos relacionados
  const buyTogetherProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 2)

  // Calcula preço total do combo
  const calculateComboPrice = (relatedProduct) => {
    return product.price + relatedProduct.price
  }

  const calculateComboDiscount = (relatedProduct) => {
    const originalTotal = product.originalPrice + relatedProduct.originalPrice
    const comboPrice = calculateComboPrice(relatedProduct)
    return originalTotal - comboPrice
  }

  const handleBuyTogether = (relatedProduct) => {
    addToCart(product, 1)
    addToCart(relatedProduct, 1)
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      navigate('/checkout')
    }, 1500)
  }

  // Calcula parcelamento
  const installmentValue = (product.price / 10).toFixed(2)

  return (
    <div className="bg-white">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          ✓ Adicionado ao carrinho!
        </div>
      )}

      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-[#246c61]">Início</Link>
            <span>/</span>
            <Link to="/produtos" className="hover:text-[#246c61]">Produtos</Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Main Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Product Info */}
          <div>
            {/* Category */}
            <p className="text-xs text-gray-500 uppercase mb-2 font-semibold tracking-wide">
              {product.category}
            </p>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            {product.reviews > 0 && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-gray-300'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.reviews})</span>
              </div>
            )}

            {/* Gallery */}
            <ProductGallery product={product} gallery={gallery} />
          </div>

          {/* Right Column - Purchase Info */}
          <div>
            <div className="mb-6 pb-6 border-b border-gray-200">
              {product.discount > 0 && (
                <p className="text-sm text-gray-400 line-through mb-1">
                  De: R$ {formatPrice(product.originalPrice)}
                </p>
              )}
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  R$ {formatPrice(product.price)}
                </span>
                {product.discount > 0 && (
                  <span className="bg-[#246c61] text-white text-xs font-bold px-2 py-1 rounded">
                    -{product.discount}%
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                ou 10x de R$ {installmentValue} sem juros
              </p>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade
              </label>
              <div className="flex items-center border border-gray-300 rounded-md w-32">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition"
                >
                  -
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Consultar Frete e Prazo */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Consultar frete e prazo
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Informações de frete válidas apenas para este produto. Confira as condições definitivas na sacola.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Digite o CEP"
                  value={cep}
                  onChange={handleCepChange}
                  maxLength="9"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#246c61] focus:border-transparent"
                />
                <button 
                  onClick={handleCheckShipping}
                  className="bg-[#246c61] hover:bg-[#1d5850] text-white font-medium px-8 py-2 rounded-md transition"
                >
                  OK
                </button>
              </div>
              <button 
                onClick={handleNotKnowCep}
                className="text-sm text-gray-500 underline mt-2 hover:text-gray-700"
              >
                Não sei o CEP
              </button>

              {/* Resultado da Consulta */}
              {shippingInfo && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-green-900">
                        🎁 Frete Grátis para {shippingInfo.city} - {shippingInfo.state}
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        Entrega em {shippingInfo.deliveryTime} após confirmação do pagamento
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-[#246c61] hover:bg-[#1d5850] text-white font-medium py-3 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Comprar
              </button>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full border-2 border-[#246c61] text-[#246c61] hover:bg-[#246c61] hover:text-white font-medium py-3 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Adicionar ao Carrinho
              </button>
            </div>

            {/* Shipping */}
            <div className="bg-gray-50 rounded-md p-4 mb-6">
              <div className="flex items-start gap-3 mb-3">
                <svg className="w-5 h-5 text-[#246c61] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900">Frete Grátis</p>
                  <p className="text-xs text-gray-600">Para todo o Brasil</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#246c61] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900">Entrega em 3-13 dias úteis</p>
                  <p className="text-xs text-gray-600">Após confirmação do pagamento</p>
                </div>
              </div>
            </div>

            {/* Garantees */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Produto 100% original</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Garantia de 30 dias</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Troca grátis</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compre Junto */}
      {buyTogetherProducts.length > 0 && (
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Compre Junto</h2>
            
            <div className="space-y-6">
              {buyTogetherProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Produto Atual */}
                    <div className="md:col-span-4">
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 uppercase mb-1">{product.category.split(' ')[0]}</p>
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                        </div>
                      </div>
                    </div>

                    {/* Ícone + */}
                    <div className="md:col-span-1 flex justify-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl text-gray-600">+</span>
                      </div>
                    </div>

                    {/* Produto Relacionado */}
                    <div className="md:col-span-4">
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 flex-shrink-0">
                          <img
                            src={relatedProduct.image}
                            alt={relatedProduct.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 uppercase mb-1">{relatedProduct.category.split(' ')[0]}</p>
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{relatedProduct.name}</h3>
                        </div>
                      </div>
                    </div>

                    {/* Preço e Botão */}
                    <div className="md:col-span-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-400 line-through mb-1">
                          R$ {formatPrice(product.originalPrice + relatedProduct.originalPrice)}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mb-1">
                          R$ {formatPrice(calculateComboPrice(relatedProduct))}
                        </p>
                        <p className="text-xs text-gray-600 mb-3">
                          2x de R$ {formatPrice(calculateComboPrice(relatedProduct) / 2)}
                        </p>
                        <button
                          onClick={() => handleBuyTogether(relatedProduct)}
                          className="w-full bg-[#246c61] hover:bg-[#1d5850] text-white font-medium py-2 px-4 rounded-md transition text-sm flex items-center justify-center gap-2"
                        >
                          COMPRAR OS 2 ITENS
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabs Section */}
      <div className="border-t border-gray-200 mt-8">
        <div className="container mx-auto px-4">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-6 py-4 text-sm font-medium transition ${
                activeTab === 'description'
                  ? 'border-b-2 border-[#246c61] text-[#246c61]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Descrição
            </button>
            {details && details.items && (
              <button
                onClick={() => setActiveTab('details')}
                className={`px-6 py-4 text-sm font-medium transition ${
                  activeTab === 'details'
                    ? 'border-b-2 border-[#246c61] text-[#246c61]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Detalhes
              </button>
            )}
            {details && details.reviews && (
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-4 text-sm font-medium transition ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-[#246c61] text-[#246c61]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Avaliações ({details.reviews.length})
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {activeTab === 'description' && (
              <div className="max-w-3xl">
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
                {details && details.fullDescription && (
                  <p className="text-gray-700 leading-relaxed mt-4">
                    {details.fullDescription}
                  </p>
                )}
              </div>
            )}

            {activeTab === 'details' && details && details.items && (
              <div className="max-w-3xl space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">O que vem no kit:</h3>
                {details.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && details && details.reviews && (
              <div className="max-w-5xl">
                {/* Resumo de Avaliações */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Avaliações</h3>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-5xl font-bold text-gray-900">
                      {product.rating.toFixed(1)}/5
                    </div>
                    <div>
                      <div className="flex text-yellow-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-6 h-6 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-gray-300'}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{product.reviews} avaliações</p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6">100% dos respondentes recomendam esse produto.</p>

                  {/* Barras de Avaliação */}
                  <div className="space-y-3">
                    {[
                      { stars: 5, count: Math.floor(product.reviews * 0.95), color: 'bg-orange-500' },
                      { stars: 4, count: Math.floor(product.reviews * 0.05), color: 'bg-orange-500' },
                      { stars: 3, count: 0, color: 'bg-gray-300' },
                      { stars: 2, count: 0, color: 'bg-gray-300' },
                      { stars: 1, count: 0, color: 'bg-gray-300' }
                    ].map((item) => (
                      <div key={item.stars} className="flex items-center gap-3">
                        <span className="text-sm font-medium text-[#246c61] w-20">
                          {item.stars} Estrela{item.stars > 1 ? 's' : ''}
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full ${item.color} transition-all`}
                            style={{ width: `${(item.count / product.reviews) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8 text-right">{item.count}</span>
                      </div>
                    ))}
                  </div>

                  {/* Botão Avaliar Produto */}
                  <button className="w-full mt-6 border-2 border-[#246c61] text-[#246c61] font-medium py-3 rounded-md hover:bg-[#246c61] hover:text-white transition">
                    Avaliar produto
                  </button>
                </div>

                {/* Avaliações Individuais */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {details.reviews.map((review) => (
                    <div key={review.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      {review.image && (
                        <img
                          src={review.image}
                          alt={`Avaliação de ${review.name}`}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <div className="flex text-yellow-400 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'fill-gray-300'}`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-sm text-gray-700 mb-3 italic">"{review.comment}"</p>
                        <p className="text-sm font-medium text-gray-900">{review.name}</p>
                        <p className="text-xs text-gray-500">{review.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clientes Também Compraram */}
      <div className="bg-white py-12 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Clientes Também Compraram</h2>
          <p className="text-gray-600 mb-6">Todo mundo ama estes produtos eficientes</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayedProducts.map(p => (
              <Link key={p.id} to={`/produto/${p.id}`} className="group">
                <div className="bg-white border border-gray-200 rounded-md overflow-hidden hover:shadow-md transition relative">
                  {/* Ícone Coração */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1.5 hover:bg-gray-100 transition-colors shadow-sm z-10"
                  >
                    <svg className="w-4 h-4 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  <div className="aspect-square overflow-hidden bg-white">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-500 uppercase mb-1 font-semibold">{p.category.split(' ')[0]}</p>
                    <h3 className="text-sm text-gray-900 mb-2 line-clamp-2 min-h-[40px]">{p.name}</h3>
                    
                    {/* Rating */}
                    {p.reviews > 0 && (
                      <div className="flex text-yellow-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(p.rating) ? 'fill-current' : 'fill-gray-300'}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                    )}

                    <p className="text-lg font-bold text-gray-900 mb-1">R$ {formatPrice(p.price)}</p>
                    <p className="text-xs text-gray-600 mb-3">
                      {Math.ceil(p.price / 22.5)}x R$ 22,{(p.price / Math.ceil(p.price / 22.5)).toFixed(2).split('.')[1]}
                    </p>

                    {/* Descrição curta */}
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                      {p.description}
                    </p>

                    {/* Botão */}
                    <button className="w-full bg-[#246c61] text-white text-xs font-medium py-2 rounded flex items-center justify-center gap-1 hover:bg-[#1d5850] transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Botão Ver Mais */}
          {!showMoreProducts && shuffledProducts.length > 4 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowMoreProducts(true)}
                className="inline-flex items-center gap-2 bg-[#246c61] text-white px-8 py-3 rounded-md font-medium hover:bg-[#1d5850] transition"
              >
                Ver Mais Produtos
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}

          {/* Botão Ver Menos */}
          {showMoreProducts && (
            <div className="text-center mt-6">
              <button
                onClick={() => {
                  setShowMoreProducts(false)
                  document.querySelector('.bg-white.py-12').scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-2 bg-gray-600 text-white px-8 py-3 rounded-md font-medium hover:bg-gray-700 transition"
              >
                Ver Menos
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Produtos Relacionados</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map(p => (
                <Link key={p.id} to={`/produto/${p.id}`} className="group">
                  <div className="bg-white rounded-md overflow-hidden hover:shadow-md transition">
                    <div className="aspect-square overflow-hidden bg-white">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-gray-500 uppercase mb-1">{p.category.split(' ')[0]}</p>
                      <h3 className="text-sm text-gray-900 mb-2 line-clamp-2">{p.name}</h3>
                      <p className="text-lg font-bold text-gray-900">R$ {formatPrice(p.price)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Links Úteis, Pagamento e Segurança */}
      <div className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="container mx-auto px-4">
          {/* Links Úteis */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Links Úteis</h2>
            <div className="max-w-2xl mx-auto space-y-3">
              <details className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition">
                  <span className="text-lg text-gray-700 font-medium">Dúvidas</span>
                  <svg className="w-5 h-5 text-[#246c61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg className="w-5 h-5 text-[#246c61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg className="w-5 h-5 text-[#246c61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="max-w-3xl mx-auto bg-white rounded-lg border border-gray-200 p-6">
              <img 
                src="/images/boti/792b7f0e-e1cc-4c68-8c0a-d02626441d1a-pagamentos.avif"
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
            <div className="max-w-3xl mx-auto bg-white rounded-lg border border-gray-200 p-6">
              <img 
                src="/images/boti/9d9f5d9c-4742-435b-aa58-729b120e2003-seguranca.avif"
                alt="Segurança"
                className="w-full max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 md:hidden">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xl font-bold text-gray-900">R$ {formatPrice(product.price)}</p>
              <p className="text-xs text-gray-600">10x de R$ {installmentValue}</p>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-[#246c61] text-white px-6 py-3 rounded-md font-medium hover:bg-[#1d5850] transition disabled:opacity-50"
            >
              Comprar
            </button>
          </div>
        </div>
      </div>

      {/* Spacer for fixed button */}
      <div className="h-20 md:hidden"></div>
    </div>
  )
}

export default ProductDetail
