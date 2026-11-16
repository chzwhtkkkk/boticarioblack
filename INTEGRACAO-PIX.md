# 💳 Como Integrar sua API Pix

## 📍 Onde fazer a integração

A integração deve ser feita no arquivo: **`src/pages/Checkout.jsx`**

Procure pela linha **~50** onde está o comentário:
```javascript
// Aqui você integrará sua API Pix
```

---

## 🔧 Exemplo de Integração

### Código Atual (Simulação)

```javascript
const handleSubmit = async (e) => {
  e.preventDefault()
  setIsProcessing(true)

  // Simulação de processamento
  setTimeout(() => {
    // Aqui você integrará sua API Pix
    const order = {
      id: Date.now(),
      user: user,
      items: cart,
      total: getCartTotal(),
      address: formData,
      date: new Date().toISOString(),
      status: 'pending'
    }
    // ...
  }, 2000)
}
```

### Código com Integração Real

```javascript
const handleSubmit = async (e) => {
  e.preventDefault()
  setIsProcessing(true)

  try {
    // Preparar dados do pedido
    const orderData = {
      user: {
        name: user.name,
        email: user.email,
        phone: formData.phone
      },
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total: getCartTotal(),
      address: {
        cep: formData.cep,
        address: formData.address,
        number: formData.number,
        complement: formData.complement,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state
      }
    }

    // Chamar sua API Pix
    const response = await fetch('https://sua-api-pix.com/criar-cobranca', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer SEU_TOKEN_AQUI' // Se necessário
      },
      body: JSON.stringify(orderData)
    })

    if (!response.ok) {
      throw new Error('Erro ao processar pagamento')
    }

    const pixData = await response.json()

    // Salvar pedido localmente
    const order = {
      id: pixData.orderId || Date.now(),
      ...orderData,
      pixCode: pixData.pixCode,
      qrCodeImage: pixData.qrCodeImage,
      date: new Date().toISOString(),
      status: 'pending'
    }

    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    orders.push(order)
    localStorage.setItem('orders', JSON.stringify(orders))

    // Limpar carrinho
    clearCart()
    setIsProcessing(false)

    // Redirecionar para página de pagamento Pix
    // Você pode criar uma nova página para mostrar o QR Code
    navigate('/pagamento-pix', { state: { pixData } })

  } catch (error) {
    console.error('Erro:', error)
    setIsProcessing(false)
    alert('Erro ao processar pedido. Tente novamente.')
  }
}
```

---

## 📄 Criar Página de Pagamento Pix

Crie um novo arquivo: **`src/pages/PaymentPix.jsx`**

```javascript
import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const PaymentPix = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { pixData } = location.state || {}
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!pixData) {
      navigate('/')
    }
  }, [pixData, navigate])

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixData.pixCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pedido Realizado!
          </h1>
          <p className="text-gray-600">
            Escaneie o QR Code ou copie o código Pix para finalizar o pagamento
          </p>
        </div>

        {/* QR Code */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex justify-center mb-4">
            <img 
              src={pixData.qrCodeImage} 
              alt="QR Code Pix" 
              className="w-64 h-64 border-4 border-white shadow-lg"
            />
          </div>
        </div>

        {/* Código Pix */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Código Pix Copia e Cola
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={pixData.pixCode}
              readOnly
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm"
            />
            <button
              onClick={copyPixCode}
              className="btn-primary"
            >
              {copied ? '✓ Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>

        {/* Valor */}
        <div className="bg-primary-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Valor a pagar:</span>
            <span className="text-2xl font-bold text-primary-600">
              R$ {pixData.total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Instruções */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Como pagar:</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
            <li>Abra o app do seu banco</li>
            <li>Escolha pagar com Pix</li>
            <li>Escaneie o QR Code ou cole o código</li>
            <li>Confirme o pagamento</li>
          </ol>
        </div>

        <button
          onClick={() => navigate('/')}
          className="btn-secondary w-full"
        >
          Voltar para a Loja
        </button>
      </div>
    </div>
  )
}

export default PaymentPix
```

### Adicionar a rota no App.jsx

No arquivo **`src/App.jsx`**, adicione:

```javascript
import PaymentPix from './pages/PaymentPix'

// Dentro de <Routes>:
<Route path="/pagamento-pix" element={<PaymentPix />} />
```

---

## 🔑 Informações que sua API Pix deve retornar

```javascript
{
  "orderId": "123456",           // ID do pedido
  "pixCode": "00020126580014...", // Código Pix copia e cola
  "qrCodeImage": "data:image/png;base64,...", // Imagem do QR Code em base64
  "total": 189.90,               // Valor total
  "expiresAt": "2026-04-25T23:59:59Z" // Expiração (opcional)
}
```

---

## 🧪 Testando sem API (Simulação)

Se ainda não tem a API pronta, pode usar este código temporário para testar a interface:

```javascript
// Simulação de resposta da API
const pixData = {
  orderId: Date.now(),
  pixCode: '00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426655440000',
  qrCodeImage: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=PIX_CODE_HERE',
  total: getCartTotal()
}

navigate('/pagamento-pix', { state: { pixData } })
```

---

## 📋 Checklist de Integração

- [ ] Obter credenciais da API Pix
- [ ] Configurar endpoint da API
- [ ] Implementar chamada no Checkout.jsx
- [ ] Criar página PaymentPix.jsx
- [ ] Adicionar rota no App.jsx
- [ ] Testar fluxo completo
- [ ] Implementar verificação de status do pagamento (webhook)
- [ ] Adicionar tratamento de erros

---

## 🔔 Verificação de Pagamento (Webhook)

Sua API Pix provavelmente oferece um webhook para notificar quando o pagamento é confirmado. Você precisará:

1. Configurar um backend para receber o webhook
2. Atualizar o status do pedido quando o pagamento for confirmado
3. Enviar email de confirmação ao cliente

---

## 💡 Dicas

- Sempre use HTTPS em produção
- Nunca exponha tokens/chaves no frontend
- Implemente timeout para pagamentos expirados
- Adicione loading states durante as requisições
- Trate todos os possíveis erros da API

---

**Boa sorte com a integração! 🚀**
