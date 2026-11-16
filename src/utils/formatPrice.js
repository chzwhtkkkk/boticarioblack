/**
 * Formata um número para o padrão brasileiro de preço
 * @param {number} value - Valor a ser formatado
 * @returns {string} - Valor formatado (ex: "43,89")
 */
export const formatPrice = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0,00'
  }
  return value.toFixed(2).replace('.', ',')
}

/**
 * Formata um número para o padrão brasileiro de preço com símbolo R$
 * @param {number} value - Valor a ser formatado
 * @returns {string} - Valor formatado (ex: "R$ 43,89")
 */
export const formatCurrency = (value) => {
  return `R$ ${formatPrice(value)}`
}
