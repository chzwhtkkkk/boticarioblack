# 🏗️ Arquitetura do Sistema - E-commerce O Boticário

## 📐 Diagrama de Arquitetura Completo

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENTE (NAVEGADOR)                            │
│                                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  ┌──────────────┐ │
│  │   Home /    │  │  /checkout   │  │  /pedido/   │  │  /rastreio   │ │
│  │  Produtos   │─▶│  (Formulário)│─▶│   [order]   │  │   (Widget)   │ │
│  │             │  │              │  │ (QR Code)   │  │              │ │
│  └─────────────┘  └──────────────┘  └─────────────┘  └──────────────┘ │
│         │                │                                    │          │
│         │                │                                    │          │
│         ▼                ▼                                    ▼          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │              CartContext (localStorage)                           │  │
│  │  - addToCart(), removeFromCart(), clearCart()                    │  │
│  │  - Persistência automática                                       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 │ HTTPS
                                 │
┌────────────────────────────────▼────────────────────────────────────────┐
│                       SEU SERVIDOR (Next.js)                             │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     FRONTEND ROUTES                               │  │
│  │  - / (Home)                                                       │  │
│  │  - /checkout (formulário + tokenização)                          │  │
│  │  - /pedido/[orderNumber] (confirmação)                           │  │
│  │  - /rastreio (widget DiaLOG)                                     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      API ROUTES                                   │  │
│  │                                                                   │  │
│  │  POST /api/orders/create                                         │  │
│  │  ├─ 1. Valida dados do pedido                                   │  │
│  │  ├─ 2. Cria/atualiza customer no Supabase                       │  │
│  │  ├─ 3. Cria order (status: pending)                             │  │
│  │  ├─ 4. Cria order_items                                         │  │
│  │  ├─ 5. Chama Avenpay API (cria pagamento)                       │  │
│  │  ├─ 6. Salva payment_id no order                                │  │
│  │  ├─ 7. Registra log                                             │  │
│  │  └─ 8. Retorna: orderNumber, paymentId, paymentData            │  │
│  │                                                                   │  │
│  │  POST /api/webhooks/avenpay                                      │  │
│  │  ├─ 1. Recebe evento (payment.paid, payment.refused, etc)      │  │
│  │  ├─ 2. Valida assinatura do webhook                            │  │
│  │  ├─ 3. Atualiza order (payment_status, paid_at)                │  │
│  │  ├─ 4. Registra log                                             │  │
│  │  └─ 5. SE PAID: chama sendToDialog()                           │  │
│  │        ├─ Formata dados do pedido                               │  │
│  │        ├─ POST DIALOG_WEBHOOK_URL                               │  │
│  │        ├─ Registra log em dialog_webhook_logs                   │  │
│  │        └─ DiaLOG: cria tracking + envia email                   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└──────────────┬────────────────┬──────────────────┬──────────────────────┘
               │                │                  │
               │ API Calls      │ Webhooks         │ Database Queries
               │                │                  │
     ┌─────────▼─────┐  ┌──────▼─────────┐  ┌────▼──────────┐
     │               │  │                │  │               │
     │  Avenpay API  │  │  Avenpay       │  │   Supabase    │
     │               │  │  (envia        │  │  PostgreSQL   │
     │  ┌─────────┐  │  │  webhooks)     │  │               │
     │  │ PIX     │  │  │                │  │  ┌──────────┐ │
     │  │ QR Code │  │  └────────────────┘  │  │customers │ │
     │  └─────────┘  │                      │  ├──────────┤ │
     │               │  ┌────────────────┐  │  │orders    │ │
     │  ┌─────────┐  │  │                │  │  ├──────────┤ │
     │  │ Cartão  │  │  │  DiaLOG API    │  │  │order_    │ │
     │  │ Token   │  │  │                │  │  │ items    │ │
     │  └─────────┘  │  │  ┌──────────┐  │  │  ├──────────┤ │
     │               │  │  │ Tracking │  │  │  │avenpay_  │ │
     │  ┌─────────┐  │  │  │  Code    │  │  │  │webhook_  │ │
     │  │ Boleto  │  │  │  └──────────┘  │  │  │ logs     │ │
     │  │ PDF     │  │  │                │  │  ├──────────┤ │
     │  └─────────┘  │  │  ┌──────────┐  │  │  │dialog_   │ │
     │               │  │  │  Email   │  │  │  │webhook_  │ │
     │               │  │  │  para    │  │  │  │ logs     │ │
     │               │  │  │ Cliente  │  │  │  └──────────┘ │
     └───────────────┘  │  └──────────┘  │  │               │
                        │                │  └───────────────┘
                        └────────────────┘
```

---

## 🔄 Fluxo de Dados Detalhado

### 1️⃣ Adicionar ao Carrinho
```
Produto click → addToCart() → CartContext atualiza → localStorage salva
                                   ↓
                            UI atualiza badge contador
```

### 2️⃣ Checkout - PIX
```
Cliente preenche formulário
    ↓
Clica "Finalizar"
    ↓
fetch('/api/orders/create', {
  method: 'POST',
  body: JSON.stringify({
    customer: { name, email, phone, taxId },
    items: [{ productId, name, price, quantity }],
    shipping: { zipCode, street, number, ... },
    payment: { method: 'PIX' }
  })
})
    ↓
Backend:
  1. supabaseAdmin.from('customers').insert() → customer_id
  2. supabaseAdmin.from('orders').insert() → order_id
  3. supabaseAdmin.from('order_items').insert()
  4. fetch('https://api.avenpayments.com/v1/payment', {
       headers: { Authorization: 'Bearer AVENPAY_API_KEY' },
       body: JSON.stringify({
         amount: total (em centavos),
         method: 'PIX',
         payer: { taxId, name, email },
         notificationUrl: 'https://seu-site.com/api/webhooks/avenpay'
       })
     })
     ↓
     Avenpay retorna: {
       id: 'pay_xxx',
       status: 'PENDING',
       data: {
         qrCode: 'iVBORw0KGgoAAAANSUhEUgAA...',
         qrCodeText: '00020126...'
       }
     }
  5. supabaseAdmin.from('orders').update({ avenpay_payment_id: 'pay_xxx' })
  6. supabaseAdmin.from('avenpay_webhook_logs').insert()
    ↓
Frontend recebe:
  {
    orderNumber: 'ORD-1234567890-ABC123',
    paymentId: 'pay_xxx',
    paymentData: { qrCode, qrCodeText }
  }
    ↓
Router push('/pedido/ORD-1234567890-ABC123')
    ↓
Página mostra QR Code + código PIX
```

### 3️⃣ Cliente Paga PIX
```
Cliente escaneia QR Code → App do banco → Paga
    ↓
Avenpay detecta pagamento confirmado
    ↓
Avenpay faz POST https://seu-site.com/api/webhooks/avenpay
Headers: {
  X-Webhook-Event: 'payment.paid',
  X-Webhook-Signature: 'assinatura_hmac'
}
Body: {
  id: 'pay_xxx',
  status: 'PAID',
  amount: 15000,
  externalRef: 'ORD-1234567890-ABC123',
  paidAt: '2025-01-20T10:30:00Z'
}
    ↓
Backend (/api/webhooks/avenpay):
  1. Valida assinatura HMAC
  2. Busca order pelo externalRef
  3. supabaseAdmin.from('orders').update({
       payment_status: 'paid',
       paid_at: new Date()
     })
  4. supabaseAdmin.from('avenpay_webhook_logs').insert()
  5. if (status === 'PAID') {
       sendToDialog(order)
     }
     ↓
     sendToDialog():
       fetch(DIALOG_WEBHOOK_URL, {
         method: 'POST',
         body: JSON.stringify({
           order_id: order.id,
           status: 'paid',
           customer: { name, email, phone, document: taxId },
           shipping_address: { street, number, city, state, zipcode },
           products: [{ name, price, quantity }],
           total: 15000
         })
       })
       ↓
       DiaLOG API recebe:
         1. Cria código de rastreio (ex: BR123456789)
         2. Envia email para cliente com tracking
         3. Disponibiliza no widget de rastreio
       ↓
       supabaseAdmin.from('dialog_webhook_logs').insert()
```

### 4️⃣ Checkout - Cartão (Tokenização Segura)
```
Cliente preenche formulário + dados do cartão
    ↓
Script Avenpay carregado:
  <script src="https://api.avenpayments.com/v1/scripts"></script>
  tokenizer.init(NEXT_PUBLIC_AVENPAY_TOKENIZATION_KEY)
    ↓
Cliente clica "Finalizar"
    ↓
Frontend:
  const cardToken = await window.tokenizer.encrypt({
    number: '5555555555554444',
    holder: 'TESTE SILVA',
    exp_month: '12',
    exp_year: '2029',
    cvv: '123'
  })
  // Retorna: "tok_encrypted_abc123xyz..."
    ↓
  fetch('/api/orders/create', {
    body: JSON.stringify({
      ...orderData,
      payment: {
        method: 'CREDIT_CARD',
        cardToken: 'tok_encrypted_abc123xyz...', ← TOKEN (não dados reais)
        installments: 1
      }
    })
  })
    ↓
Backend:
  1-3. (igual PIX)
  4. fetch('https://api.avenpayments.com/v1/payment', {
       body: JSON.stringify({
         ...paymentData,
         method: 'CREDIT_CARD',
         card: {
           token: 'tok_encrypted_abc123xyz...', ← Avenpay descriptografa
           installments: 1
         }
       })
     })
     ↓
     Avenpay:
       - Descriptografa TOKEN
       - Obtém dados reais do cartão
       - Processa pagamento com adquirente
       - Retorna status imediato
     ↓
     Resposta: {
       id: 'pay_xxx',
       status: 'PAID' ou 'REFUSED',
       card: {
         last4: '4444',
         brand: 'mastercard'
       }
     }
  5. Se PAID:
       - Atualiza order (payment_status: 'paid', paid_at: now)
       - Chama sendToDialog() IMEDIATAMENTE
       - Cliente recebe email instantâneo
     Se REFUSED:
       - Retorna erro para frontend
       - Cliente vê "Pagamento recusado"
```

### 5️⃣ Rastreio de Pedido
```
Cliente acessa /rastreio
    ↓
Widget DiaLOG carrega:
  <script src="https://widget.dialog.com/track.js"></script>
  DialogTracker.init({
    selector: '#tracker-container',
    theme: 'light'
  })
    ↓
Cliente insere CPF
    ↓
Widget faz request para DiaLOG API:
  GET https://api.dialog.com/tracking?taxId=12345678900
    ↓
DiaLOG retorna:
  [
    {
      orderNumber: 'ORD-xxx',
      trackingCode: 'BR123456789',
      status: 'in_transit',
      estimatedDelivery: '2025-01-25',
      events: [
        { date: '2025-01-20 10:30', status: 'paid', location: 'Online' },
        { date: '2025-01-21 14:00', status: 'shipped', location: 'SP' },
        { date: '2025-01-22 09:15', status: 'in_transit', location: 'Campinas' }
      ]
    }
  ]
    ↓
Widget renderiza timeline com status e movimentações
```

---

## 🔐 Segurança em Camadas

### Camada 1: Frontend (Navegador)
```
✅ Tokenização de cartão (dados sensíveis nunca saem do navegador)
✅ Validações de formulário
✅ HTTPS obrigatório
✅ CORS configurado
```

### Camada 2: Backend (Next.js API)
```
✅ Validação de dados recebidos
✅ Autenticação Avenpay via API Key
✅ Service Role Key protegida (nunca exposta)
✅ Validação de assinatura HMAC nos webhooks
✅ Rate limiting (via Vercel/host)
```

### Camada 3: Banco de Dados (Supabase)
```
✅ Row Level Security (RLS) configurável
✅ Service Role bypassa RLS (uso correto)
✅ Anon key limitada para leitura pública
✅ Backups automáticos
```

### Camada 4: Pagamentos (Avenpay)
```
✅ PCI-DSS Level 1 compliant
✅ Tokenização end-to-end
✅ Webhooks com assinatura HMAC
✅ Retry automático de webhooks
```

---

## 📊 Monitoramento e Logs

### 1. Logs de Criação de Pedido
```sql
SELECT 
  o.order_number,
  o.created_at,
  o.payment_method,
  o.total / 100.0 as total_reais,
  c.name,
  c.email
FROM orders o
JOIN customers c ON o.customer_id = c.id
ORDER BY o.created_at DESC
LIMIT 10;
```

### 2. Logs de Webhooks Avenpay
```sql
SELECT 
  awl.created_at,
  awl.event_type,
  awl.payment_id,
  o.order_number,
  awl.status_code,
  awl.response_body->>'status' as payment_status
FROM avenpay_webhook_logs awl
LEFT JOIN orders o ON awl.order_id = o.id
ORDER BY awl.created_at DESC
LIMIT 10;
```

### 3. Logs de Webhooks DiaLOG
```sql
SELECT 
  dwl.created_at,
  dwl.order_number,
  dwl.status_code,
  dwl.retry_count,
  dwl.response_body
FROM dialog_webhook_logs dwl
ORDER BY dwl.created_at DESC
LIMIT 10;
```

### 4. Pedidos com Problema (webhook falhou)
```sql
-- Pedidos pagos mas DiaLOG não recebeu (status_code != 200)
SELECT 
  o.order_number,
  o.paid_at,
  dwl.status_code,
  dwl.retry_count,
  dwl.response_body->>'error' as error_message
FROM orders o
LEFT JOIN dialog_webhook_logs dwl ON o.id = dwl.order_id
WHERE o.payment_status = 'paid'
  AND (dwl.status_code IS NULL OR dwl.status_code != 200)
ORDER BY o.paid_at DESC;
```

---

## 🔄 Tratamento de Erros e Retry

### Webhook Avenpay Falhou
```
Avenpay tenta POST /api/webhooks/avenpay
    ↓
Seu servidor retorna 500 (erro)
    ↓
Avenpay registra falha
    ↓
Aguarda 5 minutos
    ↓
Tenta novamente (retry #1)
    ↓
Se falhar de novo: aguarda 15 minutos (retry #2)
    ↓
Se falhar de novo: aguarda 1 hora (retry #3)
    ↓
Após 10 tentativas: para de tentar
    ↓
Você precisa reprocessar manualmente via painel Avenpay
```

### Webhook DiaLOG Falhou
```javascript
// Em /api/webhooks/avenpay
async function sendToDialog(order) {
  let attempt = 0;
  const maxAttempts = 3;
  
  while (attempt < maxAttempts) {
    try {
      const response = await fetch(DIALOG_WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        timeout: 10000 // 10 segundos
      });
      
      if (response.ok) {
        // Sucesso! Registra log
        await supabaseAdmin.from('dialog_webhook_logs').insert({
          order_id: order.id,
          status_code: 200,
          response_body: await response.json()
        });
        return;
      } else {
        // Erro HTTP (404, 500, etc)
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      attempt++;
      console.error(`DiaLOG attempt ${attempt} failed:`, error);
      
      if (attempt >= maxAttempts) {
        // Registra falha definitiva
        await supabaseAdmin.from('dialog_webhook_logs').insert({
          order_id: order.id,
          status_code: 0,
          retry_count: attempt,
          response_body: { error: error.message }
        });
      } else {
        // Aguarda antes de tentar de novo (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
}
```

---

## 🎯 Pontos de Integração

### 1. Avenpay → Seu Sistema
```
Endpoint: POST /api/webhooks/avenpay
Headers:
  - X-Webhook-Event: payment.paid | payment.refused | payment.refunded
  - X-Webhook-Signature: HMAC-SHA256
Body:
  - id, status, amount, externalRef, paidAt
```

### 2. Seu Sistema → DiaLOG
```
Endpoint: POST DIALOG_WEBHOOK_URL
Body:
  - order_id, status, customer{}, shipping_address{}, products[], total
Response esperada:
  - 200 OK: { trackingCode: 'BR123456789' }
  - 400 Bad Request: { error: 'Invalid data' }
```

### 3. Cliente → Widget DiaLOG
```
Frontend:
  <div id="tracker-container"></div>
  <script src="https://widget.dialog.com/track.js"></script>
  <script>
    DialogTracker.init({
      selector: '#tracker-container',
      theme: 'light',
      language: 'pt-BR'
    });
  </script>

Widget faz:
  - GET https://api.dialog.com/tracking?taxId=XXX
  - Renderiza timeline com status
```

---

## 📦 Resumo das Tecnologias

| Tecnologia | Uso | Justificativa |
|------------|-----|---------------|
| **Next.js** | Framework frontend + backend | SSR, API Routes, SEO-friendly |
| **React** | UI components | Componentização, reatividade |
| **Supabase** | Banco de dados PostgreSQL | Managed, real-time, free tier generoso |
| **Avenpay** | Gateway de pagamento | PIX + Cartão + Boleto, tokenização PCI |
| **DiaLOG** | Sistema de rastreio | Tracking code + email automático |
| **ViaCEP** | Auto-preenchimento de endereço | API pública brasileira |
| **localStorage** | Persistência do carrinho | Offline-first, simples |
| **Context API** | Estado global (carrinho) | Nativo do React, sem Redux |

---

**Este documento é um guia visual da arquitetura completa do sistema.**

Para implementação detalhada, consulte:
- `QUICK-START.md` - Começar em 5 minutos
- `FINAL-SETUP-GUIDE.md` - Guia completo
- `IMPLEMENTATION-SUMMARY.md` - Resumo técnico
