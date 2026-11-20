import { useState } from 'react'
import { products, categories } from '../data/products'
import ProductCard from '../components/ProductCard'

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [selectedKitType, setSelectedKitType] = useState('Todos')
  const [searchTerm, setSearchTerm] = useState('')

  // Tipos de kits para filtro
  const kitTypes = [
    'Todos',
    'Kits Femininos',
    'Kits Masculinos',
    'Kits Cuide-se Bem',
    'Kits Nativa Spa',
    'Kits Floratta',
    'Kits Malbec',
    'Kits Egeo'
  ]

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Filtro adicional de tipos de kit
    let matchesKitType = true
    if (selectedCategory === 'Kits e Presentes' && selectedKitType !== 'Todos') {
      const productName = product.name.toLowerCase()
      switch(selectedKitType) {
        case 'Kits Femininos':
          matchesKitType = productName.includes('lily') || productName.includes('her code') || 
                          productName.includes('floratta') || productName.includes('coffee woman') ||
                          productName.includes('elysée') || productName.includes('liz')
          break
        case 'Kits Masculinos':
          matchesKitType = productName.includes('malbec') || productName.includes('quasar') ||
                          productName.includes('zaad') || productName.includes('arbo') ||
                          productName.includes('clash') || productName.includes('botica 214')
          break
        case 'Kits Cuide-se Bem':
          matchesKitType = productName.includes('cuide-se bem')
          break
        case 'Kits Nativa Spa':
          matchesKitType = productName.includes('nativa spa')
          break
        case 'Kits Floratta':
          matchesKitType = productName.includes('floratta')
          break
        case 'Kits Malbec':
          matchesKitType = productName.includes('malbec')
          break
        case 'Kits Egeo':
          matchesKitType = productName.includes('egeo')
          break
      }
    }
    
    return matchesCategory && matchesSearch && matchesKitType
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nossos Produtos</h1>
          <p className="text-gray-600">
            Encontre os melhores produtos de beleza e perfumaria
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#246c61] focus:border-[#246c61]"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category)
                  setSelectedKitType('Todos')
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#246c61] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Kit Type Filter - Only show when Kits category is selected */}
        {selectedCategory === 'Kits e Presentes' && (
          <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filtrar por tipo:</h3>
            <div className="flex flex-wrap gap-2">
              {kitTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedKitType(type)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedKitType === type
                      ? 'bg-[#246c61] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Products Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 text-center py-16">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-500 text-sm">
              Tente buscar por outro termo ou categoria
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
