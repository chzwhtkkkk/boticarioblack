import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/formatPrice'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
    
    // Redireciona DIRETO pro checkout
    navigate('/checkout')
  }

  // Calcula parcelamento (até 10x sem juros)
  const installmentValue = (product.price / 10).toFixed(2)
  
  // 🔥 URGÊNCIA: Estoque aleatório entre 3-12 unidades
  const stockLeft = Math.floor(Math.random() * 10) + 3
  
  // 👥 PROVA SOCIAL: Número de vendas nas últimas 24h
  const soldToday = Math.floor(Math.random() * 50) + 15

  return (
    <Link to={`/produto/${product.id}`} className="group block">
      <div className="bg-white rounded-md overflow-hidden hover:shadow-md transition-shadow duration-300 relative">
        {/* Imagem do Produto */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Badge de Desconto - Canto Superior Esquerdo */}
          {product.discount > 0 && (
            <div className="absolute top-2 left-2 md:top-1.5 md:left-1.5 bg-[#246c61] text-white text-[10px] md:text-[9px] font-bold px-2 py-1 md:px-1.5 md:py-0.5 rounded">
              -{product.discount}%
            </div>
          )}

          {/* Ícone Coração - Canto Superior Direito */}
          <button 
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            className="absolute top-2 right-2 md:top-1.5 md:right-1.5 bg-white rounded-full p-1.5 md:p-1 hover:bg-gray-100 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4 md:w-3.5 md:h-3.5 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Badge Especial - Abaixo da imagem */}
        {product.featured && (
          <div className="bg-black text-white text-[9px] md:text-[8px] font-bold px-2 py-1 md:px-1.5 md:py-0.5 text-center">
            DESCONTO PRORROGADO ⚡
          </div>
        )}

        {/* Informações do Produto */}
        <div className="p-2 md:p-1.5">
          {/* Categoria/Marca */}
          <p className="text-[10px] md:text-[9px] text-gray-500 uppercase mb-1 md:mb-0.5 font-semibold tracking-wide">
            {product.category === 'Kits e Presentes' ? 'O BOTICÁRIO' : product.category.split(' ')[0]}
          </p>

          {/* Nome do Produto */}
          <h3 className="text-[13px] md:text-[11px] text-gray-900 mb-2 md:mb-1 line-clamp-2 min-h-[32px] md:min-h-[28px] font-normal leading-tight">
            {product.name}
          </h3>
          
          {/* Avaliação */}
          {product.reviews > 0 && (
            <div className="flex items-center gap-0.5 mb-1.5 md:mb-1">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-2.5 h-2.5 md:w-2 md:h-2 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-gray-300'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-[9px] md:text-[8px] text-gray-500">({product.reviews})</span>
            </div>
          )}
          
          {/* 🔥 URGÊNCIA - Estoque Limitado */}
          {stockLeft <= 10 && (
            <div className="flex items-center gap-1 mb-1.5 md:mb-1 bg-red-50 border border-red-200 rounded px-1.5 py-0.5">
              <svg className="w-3 h-3 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-[9px] md:text-[8px] text-red-700 font-semibold">
                Só {stockLeft} unidades restantes!
              </span>
            </div>
          )}
          
          {/* 👥 PROVA SOCIAL - Vendas recentes */}
          <div className="flex items-center gap-1 mb-1.5 md:mb-1">
            <svg className="w-3 h-3 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="text-[9px] md:text-[8px] text-gray-600">
              <strong className="text-green-600">{soldToday}</strong> vendidos nas últimas 24h
            </span>
          </div>

          {/* Preços */}
          <div className="mb-2 md:mb-1">
            {product.discount > 0 && (
              <p className="text-[10px] md:text-[9px] text-gray-400 line-through mb-0.5">
                R$ {formatPrice(product.originalPrice)}
              </p>
            )}
            <div className="flex items-baseline gap-1 md:gap-0.5 mb-0.5">
              <span className="text-[10px] md:text-[9px] text-gray-600">R$</span>
              <span className="text-lg md:text-base font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            </div>
            {/* Parcelamento */}
            <p className="text-[10px] md:text-[9px] text-gray-600">
              10x de R$ {installmentValue}
            </p>
          </div>

          {/* Botão Comprar com ícone de sacola */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#246c61] hover:bg-[#1d5850] text-white text-[11px] md:text-[10px] font-medium py-2 md:py-1.5 rounded transition-colors flex items-center justify-center gap-1"
          >
            <svg className="w-4 h-4 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
