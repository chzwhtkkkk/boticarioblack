import { useState, useEffect } from 'react'

const CardPaymentForm = ({ onCardReady, total }) => {
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  })
  const [installments, setInstallments] = useState(1)
  const [error, setError] = useState(null)

  // Máscara do número do cartão
  const formatCardNumber = (value) => {
    const numbers = value.replace(/\D/g, '').slice(0, 16)
    return numbers.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  // Máscara do CVV
  const formatCVV = (value) => {
    return value.replace(/\D/g, '').slice(0, 4)
  }

  // Detectar bandeira do cartão
  const getCardBrand = (number) => {
    const cleanNumber = number.replace(/\D/g, '')
    if (/^4/.test(cleanNumber)) return 'VISA'
    if (/^5[1-5]/.test(cleanNumber)) return 'MASTERCARD'
    if (/^3[47]/.test(cleanNumber)) return 'AMEX'
    if (/^(636368|438935|504175|451416|636297)/.test(cleanNumber)) return 'ELO'
    return null
  }

  const handleChange = (e) => {
    let { name, value } = e.target

    if (name === 'cardNumber') {
      value = formatCardNumber(value)
    } else if (name === 'cvv') {
      value = formatCVV(value)
    } else if (name === 'expiryMonth' || name === 'expiryYear') {
      value = value.replace(/\D/g, '').slice(0, name === 'expiryMonth' ? 2 : 4)
    } else if (name === 'cardName') {
      value = value.toUpperCase()
    }

    setCardData({ ...cardData, [name]: value })
  }

  // Validar cartão
  const validateCard = () => {
    const cleanNumber = cardData.cardNumber.replace(/\D/g, '')
    
    if (!cardData.cardName.trim()) {
      setError('Digite o nome do titular')
      return false
    }
    
    if (cleanNumber.length < 13 || cleanNumber.length > 16) {
      setError('Número do cartão inválido')
      return false
    }
    
    if (!cardData.expiryMonth || !cardData.expiryYear) {
      setError('Digite a validade do cartão')
      return false
    }
    
    const month = parseInt(cardData.expiryMonth)
    if (month < 1 || month > 12) {
      setError('Mês inválido')
      return false
    }
    
    if (cardData.cvv.length < 3) {
      setError('CVV inválido')
      return false
    }
    
    setError(null)
    return true
  }

  // Criar dados do cartão para enviar
  const handleCreateCardData = () => {
    if (!validateCard()) {
      return null
    }

    return {
      cardNumber: cardData.cardNumber.replace(/\D/g, ''),
      cardName: cardData.cardName,
      expiryMonth: cardData.expiryMonth,
      expiryYear: cardData.expiryYear,
      cvv: cardData.cvv,
      installments: installments
    }
  }

  // Passar dados do cartão para o componente pai sempre que mudar
  useEffect(() => {
    if (onCardReady) {
      onCardReady({
        getData: () => handleCreateCardData()
      })
    }
  }, [cardData, installments, onCardReady])

  // Calcular valor da parcela
  const getInstallmentValue = (installmentNumber) => {
    return (total / installmentNumber).toFixed(2)
  }

  const cardBrand = getCardBrand(cardData.cardNumber)

  return (
    <div className="space-y-4">
      {/* Nome do Titular */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Nome no Cartão *
        </label>
        <input
          type="text"
          name="cardName"
          value={cardData.cardName}
          onChange={handleChange}
          placeholder="NOME COMO ESTÁ NO CARTÃO"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 uppercase"
          required
        />
      </div>

      {/* Número do Cartão */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Número do Cartão *
        </label>
        <div className="relative">
          <input
            type="text"
            name="cardNumber"
            value={cardData.cardNumber}
            onChange={handleChange}
            placeholder="0000 0000 0000 0000"
            maxLength="19"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
          {cardBrand && (
            <span className="absolute right-3 top-3 text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {cardBrand}
            </span>
          )}
        </div>
      </div>

      {/* Validade e CVV */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Mês *
          </label>
          <input
            type="text"
            name="expiryMonth"
            value={cardData.expiryMonth}
            onChange={handleChange}
            placeholder="MM"
            maxLength="2"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Ano *
          </label>
          <input
            type="text"
            name="expiryYear"
            value={cardData.expiryYear}
            onChange={handleChange}
            placeholder="AAAA"
            maxLength="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            CVV *
          </label>
          <input
            type="text"
            name="cvv"
            value={cardData.cvv}
            onChange={handleChange}
            placeholder="123"
            maxLength="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>
      </div>

      {/* Parcelamento */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Parcelamento
        </label>
        <select
          value={installments}
          onChange={(e) => setInstallments(parseInt(e.target.value))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
            <option key={num} value={num}>
              {num}x de R$ {getInstallmentValue(num)} {num === 1 ? 'à vista' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Bandeiras aceitas */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Aceitamos:</span>
        <div className="flex gap-2">
          <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">VISA</span>
          <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">MASTER</span>
          <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">ELO</span>
          <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">AMEX</span>
        </div>
      </div>

      {/* Segurança */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-sm text-green-800">
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Pagamento 100% seguro e criptografado</span>
      </div>
    </div>
  )
}

export default CardPaymentForm
