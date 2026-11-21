import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/formatPrice'
import { products } from '../data/products'
import { useState } from 'react'

const Cart = () => {
  const navigate = useNavigate()
  const { cart, removeFromCart, updateQuantity, getCartSubtotal, getCartTotal, addToCart } = useCart()
  const [showUpsell, setShowUpsell] = useState(true)

  // Pega produtos relacionados (kits que não estão no carrinho)
  const getRelatedProducts = () => {
    const cartIds = cart.map(item => item.id)
    const kits = products.filter(p => p.category === 'Kits e Presentes' && !cartIds.includes(p.id))
    return kits.slice(0, 3) // Mostra 3 produtos
  }

  const relatedProducts = getRelatedProducts()

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow p-12">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-600 mb-6">
              Adicione produtos ao carrinho para continuar comprando
            </p>
            <Link 
              to="/produtos" 
              className="inline-block bg-[#246c61] hover:bg-[#1d5850] text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Ver Produtos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Carrinho de Compras</h1>
          <p className="text-gray-600">Revise seus produtos antes de finalizar</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow p-4"
              >
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                    <p className="text-xl font-bold text-[#246c61]">
                      R$ {formatPrice(item.price)}
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-gray-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Remover
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-center sm:text-right min-w-[100px]">
                    <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                    <p className="text-xl font-bold text-gray-900">
                      R$ {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Resumo do Pedido
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">R$ {formatPrice(getCartSubtotal())}</span>
                </div>
                
                <div className="flex justify-between text-sm text-green-600">
                  <span>🎁 Frete Grátis</span>
                  <span className="font-semibold">R$ 0,00</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-[#246c61]">R$ {formatPrice(getCartTotal())}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#246c61] hover:bg-[#1d5850] text-white font-semibold py-3 rounded-lg transition-colors mb-3"
              >
                Finalizar Compra
              </button>

              <Link
                to="/produtos"
                className="block text-center text-[#246c61] hover:text-[#1d5850] font-medium text-sm py-2 transition"
              >
                ← Continuar Comprando
              </Link>

              {/* Imagem de Pagamento Seguro */}
              <div className="mt-6 pt-6 border-t">
                <img 
                  src="/images/boti/792b7f0e-e1cc-4c68-8c0a-d02626441d1a-pagamentos.avif" 
                  alt="Pagamento Seguro"
                  className="w-full rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* UPSELL - Produtos Relacionados */}
        {showUpsell && relatedProducts.length > 0 && (
          <div className="mt-12 bg-[#246c61] rounded-lg shadow p-8 relative">
            <button
              onClick={() => setShowUpsell(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Aproveite e Leve Mais!
              </h2>
              <p className="text-white/90">
                Produtos que combinam perfeitamente com sua compra
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                        -{product.discount}%
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 text-yellow-500 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    {product.discount > 0 && (
                      <span className="text-sm text-gray-400 line-through block mb-1">
                        R$ {formatPrice(product.originalPrice)}
                      </span>
                    )}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xl font-bold text-[#246c61]">
                        R$ {formatPrice(product.price)}
                      </span>
                      <button
                        onClick={() => {
                          addToCart(product)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        className="bg-[#246c61] hover:bg-[#1d5850] text-white px-3 py-2 rounded text-sm font-semibold transition-colors"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
