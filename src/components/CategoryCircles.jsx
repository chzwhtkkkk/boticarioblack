import { Link } from 'react-router-dom'

const CategoryCircles = () => {
  const categories = [
    {
      name: 'Kits Presente',
      icon: '🎁',
      image: '/images/products/Kit Presente Dia Das Mães Liz.png',
      link: '/produtos?categoria=Kits e Presentes'
    },
    {
      name: 'Perfumes Femininos',
      icon: '💐',
      image: '/images/products/lily1.jpg',
      link: '/produtos?categoria=Perfumes Femininos'
    },
    {
      name: 'Perfumes Masculinos',
      icon: '🎩',
      image: '/images/products/malbec1.jpg',
      link: '/produtos?categoria=Perfumes Masculinos'
    },
    {
      name: 'Hidratantes',
      icon: '✨',
      image: '/images/products/nativa-spa-quinoa1.jpg',
      link: '/produtos?categoria=Hidratantes'
    },
    {
      name: 'Maquiagem',
      icon: '💄',
      image: '/images/products/make-b-base1.jpg',
      link: '/produtos?categoria=Maquiagem'
    },
    {
      name: 'Promoções',
      icon: '🔥',
      image: '/images/products/Kit Presente Dia Das Mães Elysée.png',
      link: '/produtos'
    }
  ]

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Compre por Categoria
        </h2>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className="group flex flex-col items-center animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative mb-3">
                {/* Circle with image */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-emerald-500 group-hover:border-yellow-400 transition-all duration-300 shadow-lg group-hover:shadow-xl transform group-hover:scale-110">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  {/* Fallback icon */}
                  <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-4xl" style={{ display: 'none' }}>
                    {category.icon}
                  </div>
                </div>
                
                {/* Badge */}
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                  {category.icon}
                </div>
              </div>
              
              <span className="text-xs md:text-sm font-semibold text-gray-700 text-center group-hover:text-emerald-600 transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryCircles
