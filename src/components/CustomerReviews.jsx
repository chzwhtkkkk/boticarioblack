import { useState } from 'react'

const CustomerReviews = ({ productId, reviews }) => {
  const [showAll, setShowAll] = useState(false)
  
  if (!reviews || reviews.length === 0) {
    return null
  }

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3)
  
  // Calcula a média de avaliações
  const averageRating = (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
  
  // Conta quantas avaliações de cada estrela
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => 
    reviews.filter(r => r.rating === rating).length
  )

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Avaliações de Clientes
      </h2>

      {/* Resumo de Avaliações */}
      <div className="grid md:grid-cols-2 gap-6 mb-8 pb-8 border-b">
        {/* Nota Média */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <span className="text-5xl font-bold text-gray-900">{averageRating}</span>
            <div>
              <div className="flex text-yellow-400 mb-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(averageRating) ? 'fill-current' : 'fill-gray-300'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-600">{reviews.length} avaliações</p>
            </div>
          </div>
          <p className="text-sm text-green-600 font-medium mt-2">
            ✓ {Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100)}% dos clientes recomendam
          </p>
        </div>

        {/* Distribuição de Estrelas */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((stars, index) => {
            const count = ratingCounts[index]
            const percentage = (count / reviews.length) * 100
            
            return (
              <div key={stars} className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm text-gray-700">{stars}</span>
                  <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Lista de Avaliações */}
      <div className="space-y-6">
        {displayedReviews.map((review) => (
          <div key={review.id} className="border-b pb-6 last:border-0">
            {/* Cabeçalho da Avaliação */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{review.name}</h3>
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Compra verificada
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'fill-gray-300'}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
              </div>
            </div>

            {/* Comentário */}
            <p className="text-gray-700 leading-relaxed">{review.comment}</p>

            {/* Útil/Não Útil */}
            <div className="flex items-center gap-4 mt-4">
              <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                Útil
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                </svg>
                Denunciar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Botão Ver Mais */}
      {reviews.length > 3 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-[#246c61] hover:text-[#246c61] transition-colors font-medium"
          >
            {showAll ? 'Ver menos avaliações' : `Ver todas as ${reviews.length} avaliações`}
          </button>
        </div>
      )}
    </div>
  )
}

export default CustomerReviews
