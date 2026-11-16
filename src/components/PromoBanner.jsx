import { Link } from 'react-router-dom'

const PromoBanner = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Banner 1 - Frete Grátis */}
          <Link to="/produtos" className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-8 text-white">
              <div className="text-5xl mb-3">🚚</div>
              <h3 className="text-2xl font-bold mb-2">Frete Grátis</h3>
              <p className="text-blue-100 mb-4">Para Todo o Brasil</p>
              <span className="inline-block bg-white text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
                Aproveite →
              </span>
            </div>
          </Link>

          {/* Banner 2 - Kits Especiais */}
          <Link to="/produtos" className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
            <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-8 text-white">
              <div className="text-5xl mb-3">💝</div>
              <h3 className="text-2xl font-bold mb-2">Kits Especiais</h3>
              <p className="text-pink-100 mb-4">Descontos de até 70% OFF</p>
              <span className="inline-block bg-white text-pink-700 px-4 py-2 rounded-full text-sm font-bold">
                Ver Kits →
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default PromoBanner
