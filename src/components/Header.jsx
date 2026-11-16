import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

// Header O Boticário - v2.0
const Header = () => {
  const { getCartCount } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Primeira linha - Logo e Ícones */}
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/images/boti/logo.svg" 
              alt="O Boticário" 
              className="h-8 md:h-10"
            />
          </Link>

          {/* Ícones direita - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/carrinho" className="relative text-gray-600 hover:text-black">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>
          </div>

          {/* Ícones direita - Mobile */}
          <div className="flex md:hidden items-center space-x-3">
            <Link to="/carrinho" className="relative text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Segunda linha - Menu e Busca */}
        <div className="flex items-center gap-3 py-3">
          {/* Botão Menu Hambúrguer */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700 hover:text-black"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Barra de Busca */}
          <form onSubmit={handleSearch} className="flex-1 relative">
            <input
              type="text"
              placeholder="O que você procura hoje?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black pr-10"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="pb-4 animate-fadeIn border-t border-gray-200">
            <nav className="flex flex-col space-y-2 pt-3">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-black font-medium py-2 px-4 rounded hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Início
              </Link>
              <Link 
                to="/produtos" 
                className="text-gray-700 hover:text-black font-medium py-2 px-4 rounded hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Produtos
              </Link>
              <Link 
                to="/meus-pedidos" 
                className="text-gray-700 hover:text-black font-medium py-2 px-4 rounded hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Meus Pedidos
              </Link>
              <Link 
                to="/rastreio" 
                className="text-gray-700 hover:text-black font-medium py-2 px-4 rounded hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Rastrear Pedido
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
