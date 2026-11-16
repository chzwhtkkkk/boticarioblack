const TrustBadges = () => {
  return (
    <section className="bg-gradient-to-r from-green-50 to-emerald-50 py-6 border-y border-green-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {/* Retirada na Loja */}
          <div className="flex flex-col items-center text-center group">
            <div className="bg-white rounded-full p-3 md:p-4 shadow-sm group-hover:shadow-md transition-shadow mb-2">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xs md:text-sm font-bold text-gray-800 mb-0.5">Retire na Loja</h3>
            <p className="text-[10px] md:text-xs text-gray-600">
              Disponível em até 24h
            </p>
          </div>

          {/* Entrega Garantida */}
          <div className="flex flex-col items-center text-center group">
            <div className="bg-white rounded-full p-3 md:p-4 shadow-sm group-hover:shadow-md transition-shadow mb-2">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
            </div>
            <h3 className="text-xs md:text-sm font-bold text-gray-800 mb-0.5">Entrega Rápida</h3>
            <p className="text-[10px] md:text-xs text-gray-600">
              Rastreamento em tempo real
            </p>
          </div>

          {/* Produto Original */}
          <div className="flex flex-col items-center text-center group">
            <div className="bg-white rounded-full p-3 md:p-4 shadow-sm group-hover:shadow-md transition-shadow mb-2">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xs md:text-sm font-bold text-gray-800 mb-0.5">100% Original</h3>
            <p className="text-[10px] md:text-xs text-gray-600">
              Produtos autênticos O Boticário
            </p>
          </div>

          {/* Devolução Grátis */}
          <div className="flex flex-col items-center text-center group">
            <div className="bg-white rounded-full p-3 md:p-4 shadow-sm group-hover:shadow-md transition-shadow mb-2">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-xs md:text-sm font-bold text-gray-800 mb-0.5">Devolução Grátis</h3>
            <p className="text-[10px] md:text-xs text-gray-600">
              Até 7 dias para trocar
            </p>
          </div>

          {/* Compra Segura */}
          <div className="flex flex-col items-center text-center group">
            <div className="bg-white rounded-full p-3 md:p-4 shadow-sm group-hover:shadow-md transition-shadow mb-2">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xs md:text-sm font-bold text-gray-800 mb-0.5">Compra 100% Segura</h3>
            <p className="text-[10px] md:text-xs text-gray-600">
              Pagamento via PIX protegido
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrustBadges
