import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState([])

  useEffect(() => {
    window.scrollTo(0, 0)
    
    if (query.trim()) {
      // Busca produtos que contenham o termo no nome, categoria ou descrição
      const searchTerm = query.toLowerCase()
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      )
      setResults(filtered)
    } else {
      setResults([])
    }
  }, [query])

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link to="/" className="hover:text-[#246c61]">Início</Link>
            <span>/</span>
            <span className="text-gray-900">Busca</span>
          </div>
        </div>

        {/* Título da Busca */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Resultados para: "{query}"
          </h1>
          <p className="text-gray-600">
            {results.length > 0 
              ? `${results.length} produto${results.length > 1 ? 's' : ''} encontrado${results.length > 1 ? 's' : ''}`
              : 'Nenhum produto encontrado'
            }
          </p>
        </div>

        {/* Resultados */}
        {results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1.5 md:gap-2">
            {results.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Mensagem quando não encontra produtos */
          <div className="text-center py-16">
            <div className="mb-6">
              <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Nenhum produto encontrado
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Não encontramos produtos com o termo "{query}". Tente buscar por outros produtos ou navegue pelas nossas categorias.
            </p>
            
            {/* Sugestões */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sugestões de busca:</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {['Malbec', 'Lily', 'Floratta', 'Egeo', 'Kits', 'Perfumes'].map(suggestion => (
                  <Link
                    key={suggestion}
                    to={`/busca?q=${suggestion}`}
                    className="px-4 py-2 bg-gray-100 hover:bg-[#246c61] hover:text-white text-gray-700 rounded-full text-sm font-medium transition"
                  >
                    {suggestion}
                  </Link>
                ))}
              </div>
            </div>

            <Link 
              to="/produtos" 
              className="inline-block bg-[#246c61] hover:bg-[#1d5850] text-white font-medium px-8 py-3 rounded-md transition"
            >
              Ver Todos os Produtos
            </Link>
          </div>
        )}

        {/* Produtos Relacionados - Mostrar alguns produtos aleatórios quando não há resultados */}
        {results.length === 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Você pode gostar</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1.5 md:gap-2">
              {products
                .sort(() => Math.random() - 0.5)
                .slice(0, 10)
                .map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchResults
