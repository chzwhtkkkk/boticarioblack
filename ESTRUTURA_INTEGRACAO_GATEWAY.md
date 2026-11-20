# 📋 ESTRUTURA DE INTEGRAÇÃO - O BOTICÁRIO VENDAS

## 🌐 Informações do Site

- **URL:** https://oboticariovendas.vercel.app
- **Plataforma:** React + Vite (hospedado na Vercel)
- **Backend:** Vercel Serverless Functions (Node.js)
- **Banco de Dados:** Supabase (PostgreSQL)
- **Webhook URL:** `https://oboticariovendas.vercel.app/api/webhooks/avenpay`

---

## 📤 ESTRUTURA DE ENVIO (Checkout → API)

### Endpoint: `/api/orders/create`
**Método:** `POST`

### Payload que o frontend envia:

```json
{
  "customer": {
    "name": "João da Silva",
    "email": "cliente@email.com",
    "phone": "11999887766",
    "taxId": "12345678900"
  },
  "items": [
    {
      "id": 84,
      "productId": 84,
      "name": "Kit Presente Cuide-se Bem Deleite (4 itens) O Boticário",
      "price": 4160,
      "quantity": 1,
      "image": "/images/produto.webp"
    }
  ],
  "shipping": {
    "zipCode": "78557530",
    "street": "Avenida Foz do Iguaçu",
    "number": "530",
    "complement": "Apto 101",
    "neighborhood": "Jardim Terra Rica",
    "city": "Sinop",
    "state": "MT",
    "country": "BR"
  },
  "payment": {
    "method": "PIX"
  }
}
```

### ⚠️ IMPORTANTE:
- **Preços em CENTAVOS** (ex: R$ 41,60 = 4160)
- **phone**: apenas números (sem máscara)
- **taxId**: CPF apenas números (sem pontos/traços)
- **zipCode**: CEP apenas números

---

## 💳 ESTRUTURA QUE ENVIAMOS PARA O GATEWAY

### Formato atual (usado com Avenpay):

```json
{
  "amount": 5660,
  "currency": "BRL",
  "method": "PIX",
  "description": "Pedido ORD-1795032114006-35LZ2T",
  "externalRef": "ORD-1795032114006-35LZ2T",
  "notificationUrl": "https://oboticariovendas.vercel.app/api/webhooks/avenpay",
  "ip": "138.0.250.194",
  "payer": {
    "name": "João da Silva",
    "taxId": "12345678900",
    "email": "cliente@email.com",
    "phone": "11999887766"
  },
  "items": [
    {
      "quantity": 1,
      "name": "Kit Presente Cuide-se Bem Deleite (4 itens) O Boticário",
      "price": 4160,
      "type": "PHYSICAL"
    }
  ],
  "delivery": {
    "fee": 1500,
    "address": {
      "country": "BR",
      "state": "MT",
      "city": "Sinop",
      "district": "Jardim Terra Rica",
      "street": "Avenida Foz do Iguaçu",
      "number": "530",
      "zipCode": "78557530",
      "complement": "Apto 101"
    }
  }
}
```

### 📝 Detalhes:
- **amount**: Valor total em centavos (subtotal + frete)
- **externalRef**: Número único do pedido (formato: `ORD-{timestamp}-{random}`)
- **notificationUrl**: URL para receber webhooks de confirmação
- **delivery.fee**: Frete fixo de R$ 15,00 (1500 centavos)

---

## 🔄 ESTRUTURA PÓS-COMPRA (Webhook)

### Endpoint: `/api/webhooks/avenpay`
**Método:** `POST`

### O que ESPERAMOS receber do Gateway:

```json
{
  "id": "pay_abc123xyz",
  "status": "PAID",
  "amount": 5660,
  "method": "PIX",
  "externalRef": "ORD-1795032114006-35LZ2T",
  "paidAt": "2024-11-18T17:01:55Z",
  "data": {
    "qrCode": "00020126360014br.gov.bcb.pix...",
    "qrCodeUrl": "https://link-para-qrcode.png",
    "pixKey": "chave-pix-aqui"
  }
}
```

### 🎯 Status possíveis que processamos:

| Status | Ação no Sistema |
|--------|----------------|
| `PAID` | Marca pedido como pago + Envia para DiaLOG |
| `PENDING` | Mantém como pendente |
| `PROCESSING` | Aguardando confirmação |
| `REFUSED` | Cancela pedido |
| `REFUNDED` | Marca como reembolsado |

---

## 📦 FLUXO PÓS-PAGAMENTO (INTEGRAÇÃO DIALOG)

### Quando recebemos `status: "PAID"` do gateway:

**1. Atualizamos o pedido no banco:**
```sql
UPDATE orders SET
  status = 'paid',
  payment_status = 'paid',
  paid_at = NOW()
WHERE order_number = 'ORD-xxx'
```

**2. Enviamos AUTOMATICAMENTE para DiaLOG:**

**URL DiaLOG:**
```
https://dnpgrcriaqpcybhzikvh.supabase.co/functions/v1/webhook-checkout/universal/c688fd32-379c-425e-a8ad-cc600ad69539?token=d04d15b2b59f4363a9064194ecb413973e46cc80249b43318d6c72f0f9ce93ae
```

**Payload enviado para DiaLOG:**
```json
{
  "order_id": "ORD-1795032114006-35LZ2T",
  "status": "paid",
  "external_reference": "ORD-1795032114006-35LZ2T",
  "customer": {
    "name": "João da Silva",
    "email": "cliente@email.com",
    "phone": "11999887766",
    "document": "12345678900"
  },
  "shipping_address": {
    "street": "Avenida Foz do Iguaçu",
    "number": "530",
    "complement": "Apto 101",
    "neighborhood": "Jardim Terra Rica",
    "city": "Sinop",
    "state": "MT",
    "zipcode": "78557530",
    "country": "BR"
  },
  "products": [
    {
      "name": "Kit Presente Cuide-se Bem Deleite (4 itens) O Boticário",
      "price": 41.60,
      "quantity": 1,
      "weight": 0.5
    }
  ],
  "total": 56.60
}
```

**3. DiaLOG processa e:**
- ✉️ Envia email de confirmação para o cliente
- 📦 Gera código de rastreio
- 📧 Envia email com link de rastreamento

---

## 🗄️ ESTRUTURA DO BANCO DE DADOS

### Tabela: `customers`
```sql
- id (uuid, PK)
- name (text)
- email (text)
- phone (text)
- tax_id (text, unique) -- CPF
- created_at (timestamp)
```

### Tabela: `orders`
```sql
- id (uuid, PK)
- customer_id (uuid, FK → customers)
- order_number (text, unique)
- status (text) -- pending, paid, cancelled, refunded
- subtotal (integer) -- em centavos
- shipping_fee (integer) -- em centavos
- total (integer) -- em centavos
- currency (text) -- BRL
- payment_method (text) -- PIX, CREDIT_CARD, BOLETO
- payment_status (text) -- pending, paid, refused, refunded
- avenpay_payment_id (text) -- ID do pagamento no gateway
- shipping_address (jsonb) -- endereço completo
- paid_at (timestamp)
- created_at (timestamp)
```

### Tabela: `order_items`
```sql
- id (uuid, PK)
- order_id (uuid, FK → orders)
- product_id (integer)
- product_name (text)
- product_image (text)
- quantity (integer)
- unit_price (integer) -- em centavos
- total_price (integer) -- em centavos
- created_at (timestamp)
```

### Tabela: `avenpay_webhook_logs`
```sql
- id (uuid, PK)
- order_id (uuid, FK → orders)
- payment_id (text)
- event_type (text)
- status_code (integer)
- request_body (jsonb)
- response_body (jsonb)
- error_message (text)
- created_at (timestamp)
```

### Tabela: `dialog_webhook_logs`
```sql
- id (uuid, PK)
- order_id (uuid, FK → orders)
- order_number (text)
- status_code (integer)
- request_body (jsonb)
- response_body (jsonb)
- error_message (text)
- retry_count (integer)
- created_at (timestamp)
```

---

## 🔐 HEADERS NECESSÁRIOS

### Para receber webhooks:
```
Content-Type: application/json
X-Webhook-Event: payment.updated (ou outro evento)
X-Webhook-Signature: assinatura-hmac (se necessário)
```

### Para enviar para o gateway:
```
Authorization: Bearer {API_KEY}
Content-Type: application/json
```

---

## ⚙️ VARIÁVEIS DE AMBIENTE CONFIGURADAS

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://onscojkssuytbqzqgafu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_HAeCbLMh1pRPOhPoOklOoA_tYAdQ4x2pRE
SUPABASE_SERVICE_ROLE_KEY=sb_secret_K85-EleZGXPbBRyE_H3SMQ_LnCge1_j

# Gateway de Pagamento (a ser atualizado)
AVENPAY_API_KEY=d_5SKkAF0pnKaSJ0OLKrsPdbr9LRcw8Qyox6Kz1keXw
NEXT_PUBLIC_AVENPAY_TOKENIZATION_KEY=XgyrLYl000r9gv4BDro6puMrTtLBS3mfmwG2HNH6NjY

# DiaLOG (Sistema de Rastreio)
DIALOG_WEBHOOK_URL=https://dnpgrcriaqpcybhzikvh.supabase.co/functions/v1/webhook-checkout/universal/c688fd32-379c-425e-a8ad-cc600ad69539?token=d04d15b2b59f4363a9064194ecb413973e46cc80249b43318d6c72f0f9ce93ae
```

---

## 📊 FLUXO COMPLETO

```
┌─────────────────┐
│   CHECKOUT      │
│   (Frontend)    │
└────────┬────────┘
         │ POST /api/orders/create
         │ {customer, items, shipping, payment}
         ▼
┌─────────────────┐
│  API CREATE     │
│  1. Salva no DB │
│  2. Chama       │
│     Gateway     │
└────────┬────────┘
         │ POST https://api.gateway.com/v1/payment
         │ {amount, payer, items, delivery}
         ▼
┌─────────────────┐
│   GATEWAY       │
│   Processa PIX  │
│   Gera QR Code  │
└────────┬────────┘
         │ Retorna {qrCode, paymentId}
         ▼
┌─────────────────┐
│   FRONTEND      │
│   Mostra QR     │
│   Cliente paga  │
└─────────────────┘
         │
         │ (Cliente paga o PIX)
         │
         ▼
┌─────────────────┐
│   GATEWAY       │
│   Confirma      │
│   pagamento     │
└────────┬────────┘
         │ POST /api/webhooks/avenpay
         │ {id, status: "PAID", externalRef}
         ▼
┌─────────────────┐
│  API WEBHOOK    │
│  1. Atualiza DB │
│  2. Envia       │
│     DiaLOG      │
└────────┬────────┘
         │ POST dialog_webhook_url
         │ {order, customer, products}
         ▼
┌─────────────────┐
│    DIALOG       │
│  1. Gera código │
│  2. Envia email │
│     pro cliente │
└─────────────────┘
```

---

## 🎯 RESUMO PARA O NOVO GATEWAY

### O que precisamos do novo gateway:

1. **API para criar pagamento PIX**
   - Recebe: dados do cliente + produtos + valor
   - Retorna: QR Code + ID do pagamento

2. **Webhook de confirmação**
   - Envia para: `https://oboticariovendas.vercel.app/api/webhooks/avenpay`
   - Quando: Pagamento confirmado
   - Com: `{id, status, externalRef, paidAt}`

3. **Métodos suportados:**
   - ✅ PIX (obrigatório)
   - ✅ Cartão de crédito (desejável)
   - ✅ Boleto (desejável)

### O que TEMOS pronto:

- ✅ Frontend completo
- ✅ API de criação de pedidos
- ✅ Banco de dados estruturado
- ✅ Webhook handler pronto
- ✅ Integração automática com DiaLOG
- ✅ Logs completos de todas operações

---

## 📞 CONTATO

- **Site:** https://oboticariovendas.vercel.app
- **GitHub:** https://github.com/charles15am/oboticario.revendasss
- **Webhook Test URL:** `https://oboticariovendas.vercel.app/api/webhooks/avenpay`

---

**Última atualização:** 18/11/2024
**Status:** Aguardando novo gateway de pagamento
