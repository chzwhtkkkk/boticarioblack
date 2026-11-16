import { useState } from 'react'

const ProductGallery = ({ product, gallery }) => {
  const [activeMedia, setActiveMedia] = useState('image')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // Se tiver galeria, usa as imagens da galeria, senão usa a imagem do produto
  const images = gallery?.gallery || [product.image]
  const currentImage = images[currentImageIndex]

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-4">
      {/* Main Display */}
      <div className="relative rounded-lg overflow-hidden shadow-2xl bg-gray-100 aspect-square">
        {activeMedia === 'image' ? (
          <>
            <img
              src={currentImage}
              alt={`${product.name} - Imagem ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Setas de navegação (só aparecem se tiver mais de 1 imagem) */}
            {images.length > 1 && (
              <>
                {/* Seta Anterior */}
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all hover:scale-110 z-20"
                  aria-label="Imagem anterior"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Seta Próxima */}
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all hover:scale-110 z-20"
                  aria-label="Próxima imagem"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Indicador de posição */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium z-20">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </>
        ) : (
          <video
            src={product.video}
            controls
            autoPlay
            loop
            muted={!isPlaying}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-cover"
          >
            Seu navegador não suporta vídeos.
          </video>
        )}

        {/* Badges na galeria */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.bestSeller && (
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg animate-pulse">
              🔥 Mais Vendido
            </span>
          )}
          {product.discount > 0 && (
            <span className="bg-red-500 text-white text-lg font-bold px-4 py-2 rounded-full shadow-lg">
              -{product.discount}% OFF
            </span>
          )}
        </div>

        {/* Play button overlay quando não está tocando */}
        {activeMedia === 'video' && !isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="bg-white/90 rounded-full p-6 shadow-xl">
              <svg className="w-12 h-12 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnails - Imagens da Galeria */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentImageIndex(index)
                setActiveMedia('image')
              }}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-4 transition-all ${
                activeMedia === 'image' && currentImageIndex === index
                  ? 'border-primary-600 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}

          {/* Video Thumbnail (se existir) */}
          {product.video && (
            <button
              onClick={() => setActiveMedia('video')}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-4 transition-all ${
                activeMedia === 'video'
                  ? 'border-primary-600 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <video
                src={product.video}
                className="w-full h-full object-cover"
                muted
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-full p-1.5">
                  <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </button>
          )}
        </div>
      )}

      {/* Thumbnails antigas (quando só tem 1 imagem e vídeo) */}
      {images.length === 1 && product.video && (
        <div className="flex gap-3">
          {/* Image Thumbnail */}
          <button
            onClick={() => setActiveMedia('image')}
            className={`relative flex-1 rounded-lg overflow-hidden border-4 transition-all ${
              activeMedia === 'image'
                ? 'border-primary-600 shadow-lg scale-105'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <img
              src={product.image}
              alt="Imagem do produto"
              className="w-full h-24 object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </button>

          {/* Video Thumbnail */}
          <button
            onClick={() => setActiveMedia('video')}
            className={`relative flex-1 rounded-lg overflow-hidden border-4 transition-all ${
              activeMedia === 'video'
                ? 'border-primary-600 shadow-lg scale-105'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <video
              src={product.video}
              className="w-full h-24 object-cover"
              muted
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-full p-2">
                <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
              Vídeo
            </span>
          </button>
        </div>
      )}
    </div>
  )
}

export default ProductGallery
