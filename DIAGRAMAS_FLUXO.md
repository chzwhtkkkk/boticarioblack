# 📊 DIAGRAMAS DE FLUXO - O BOTICÁRIO VENDAS

## 🔄 FLUXO GERAL DO SISTEMA

```
┌──────────────────────────────────────────────────────────────────────┐
│                         FLUXO COMPLETO                                │
└──────────────────────────────────────────────────────────────────────┘

    👤 CLIENTE                🌐 FRONTEND           ⚙️ BACKEND           💳 GATEWAY          📦 DIALOG
       │                         │                      │                    │                  │
       │ 1. Adiciona produtos    │                      │                    │                  │
       │────────────────────────>│                      │                    │                  │
       │                         │                      │                    │                  │
       │ 2. Preenche checkout    │                      │                    │                  │
       │────────────────────────>│                      │                    │                  │
       │                         │                      │                    │                  │
       │ 3. Finaliza compra      │                      │                    │                  │
       │────────────────────────>│                      │                    │                  │
       │                         │                      │                    │                  │
       │                         │ POST /api/orders/    │                    │                  │
       │                         │────────────────────>│                    │                  │
       │                         │                      │                    │                  │
       │                         │                      │ Salva no Supabase  │                  │
       │                         │                      │ (customer, order,  │                  │
       │                         │                      │  order_items)      │                  │
       │                         │                      │                    │                  │
       │                         │                      │ POST /v1/payment   │                  │
       │                         │                      │───────────────────>│                  │
       │                         │                      │                    │                  │
       │                         │                      │ {qrCode, paymentId}│                  │
       │                         │                      │<───────────────────│                  │
       │                         │                      │                    │                  │
       │                         │ {success, qrCode}    │                    │                  │
       │                         │<────────────────────│                    │                  │
       │                         │                      │                    │                  │
       │   MOSTRA QR CODE PIX    │                      │                    │                  │
       │<────────────────────────│                      │                    │                  │
       │                         │                      │                    │                  │
       │ 4. Paga o PIX no banco  │                      │                    │                  │
       │────────────────────────────────────────────────>│                  │                  │
       │                         │                      │                    │                  │
       │                         │                      │  Confirma pagamento│                  │
       │                         │                      │                    │                  │
       │                         │                      │ POST /webhooks/    │                  │
       │                         │                      │<───────────────────│                  │
       │                         │                      │ {status: "PAID"}   │                  │
       │                         │                      │                    │                  │
       │                         │                      │ Atualiza status    │                  │
       │                         │                      │ no Supabase        │                  │
       │                         │                      │                    │                  │
       │                         │                      │ POST dialog_webhook│                  │
       │                         │                      │───────────────────────────────────────>│
       │                         │                      │ {order, customer,  │                  │
       │                         │                      │  products}         │                  │
       │                         │                      │                    │                  │
       │                         │                      │                    │   Gera código    │
       │                         │                      │                    │   de rastreio    │
       │                         │                      │                    │                  │
       │                         ✉️ EMAIL COM TRACKING │                    │                  │
       │<──────────────────────────────────────────────────────────────────────────────────────│
       │   - Confirmação de compra                      │                    │                  │
       │   - Código de rastreio                         │                    │                  │
       │   - Link para rastrear                         │                    │                  │
       │                         │                      │                    │                  │
```

---

## 📤 ESTRUTURA DE DADOS - CRIAÇÃO DE PEDIDO

```
┌─────────────────────────────────────────────────────────────────────┐
│                  POST /api/orders/create                             │
└─────────────────────────────────────────────────────────────────────┘

FRONTEND ENVIA:
┌─────────────────┐
│   customer      │
│  - name         │
│  - email        │
│  - phone        │
│  - taxId (CPF)  │
└─────────────────┘
         +
┌─────────────────┐
│     items       │
│  - id           │
│  - name         │
│  - price (¢)    │ ← CENTAVOS!
│  - quantity     │
│  - image        │
└─────────────────┘
         +
┌─────────────────┐
│   shipping      │
│  - zipCode      │
│  - street       │
│  - number       │
│  - complement   │
│  - neighborhood │
│  - city         │
│  - state        │
│  - country      │
└─────────────────┘
         +
┌─────────────────┐
│    payment      │
│  - method (PIX) │
└─────────────────┘

         ↓ BACKEND PROCESSA ↓

┌────────────────────────────┐
│  1. SALVA NO SUPABASE      │
│                            │
│  customers                 │
│  ├─ id (uuid)              │
│  ├─ name                   │
│  ├─ email                  │
│  ├─ phone                  │
│  └─ tax_id (CPF)           │
│                            │
│  orders                    │
│  ├─ id (uuid)              │
│  ├─ customer_id            │
│  ├─ order_number           │
│  ├─ status: "pending"      │
│  ├─ subtotal (¢)           │
│  ├─ shipping_fee (¢)       │
│  ├─ total (¢)              │
│  ├─ payment_method         │
│  └─ shipping_address       │
│                            │
│  order_items               │
│  ├─ id (uuid)              │
│  ├─ order_id               │
│  ├─ product_name           │
│  ├─ quantity               │
│  ├─ unit_price (¢)         │
│  └─ total_price (¢)        │
└────────────────────────────┘

         ↓ CHAMA GATEWAY ↓

┌────────────────────────────┐
│  2. ENVIA PARA GATEWAY     │
│                            │
│  POST /v1/payment          │
│  {                         │
│    amount: 5660,           │
│    currency: "BRL",        │
│    method: "PIX",          │
│    externalRef: "ORD-...", │
│    notificationUrl: "...", │
│    payer: {...},           │
│    items: [...],           │
│    delivery: {...}         │
│  }                         │
└────────────────────────────┘

         ↓ GATEWAY RETORNA ↓

┌────────────────────────────┐
│  3. RESPOSTA DO GATEWAY    │
│                            │
│  {                         │
│    id: "pay_abc123",       │
│    status: "PENDING",      │
│    qrCode: "00020126...",  │
│    qrCodeUrl: "https://",  │
│    expiresAt: "2024-..."   │
│  }                         │
└────────────────────────────┘

         ↓ RETORNA PRO FRONTEND ↓

┌────────────────────────────┐
│  4. FRONTEND RECEBE        │
│                            │
│  {                         │
│    success: true,          │
│    orderNumber: "ORD-...", │
│    paymentData: {          │
│      qrCode: "...",        │
│      qrCodeUrl: "..."      │
│    }                       │
│  }                         │
│                            │
│  → MOSTRA QR CODE PIX      │
└────────────────────────────┘
```

---

## 📥 ESTRUTURA DE DADOS - WEBHOOK (PÓS-PAGAMENTO)

```
┌─────────────────────────────────────────────────────────────────────┐
│                  POST /api/webhooks/avenpay                          │
└─────────────────────────────────────────────────────────────────────┘

GATEWAY ENVIA:
┌────────────────────────────┐
│  Headers:                  │
│  - X-Webhook-Event         │
│  - X-Webhook-Signature     │
│                            │
│  Body:                     │
│  {                         │
│    id: "pay_abc123",       │
│    status: "PAID",         │ ← STATUS PRINCIPAL
│    amount: 5660,           │
│    method: "PIX",          │
│    externalRef: "ORD-...", │
│    paidAt: "2024-11-18..." │
│  }                         │
└────────────────────────────┘

         ↓ WEBHOOK PROCESSA ↓

┌────────────────────────────┐
│  1. BUSCA PEDIDO NO DB     │
│                            │
│  SELECT * FROM orders      │
│  WHERE order_number =      │
│    payload.externalRef     │
└────────────────────────────┘

         ↓ STATUS = "PAID" ↓

┌────────────────────────────┐
│  2. ATUALIZA NO SUPABASE   │
│                            │
│  UPDATE orders SET         │
│    status = 'paid',        │
│    payment_status = 'paid',│
│    paid_at = NOW()         │
│  WHERE id = order.id       │
└────────────────────────────┘

         ↓ REGISTRA LOG ↓

┌────────────────────────────┐
│  3. SALVA LOG              │
│                            │
│  INSERT INTO               │
│  avenpay_webhook_logs      │
│  {                         │
│    order_id,               │
│    payment_id,             │
│    event_type,             │
│    request_body,           │
│    response_body           │
│  }                         │
└────────────────────────────┘

         ↓ ENVIA PARA DIALOG ↓

┌────────────────────────────┐
│  4. CHAMA DIALOG API       │
│                            │
│  POST dialog_webhook_url   │
│  {                         │
│    order_id: "ORD-...",    │
│    status: "paid",         │
│    customer: {             │
│      name, email, phone    │
│    },                      │
│    shipping_address: {...},│
│    products: [...]         │
│  }                         │
└────────────────────────────┘

         ↓ DIALOG PROCESSA ↓

┌────────────────────────────┐
│  5. DIALOG ENVIA EMAIL     │
│                            │
│  ✉️ Para: cliente@email    │
│                            │
│  Assunto:                  │
│  "Pedido Confirmado!"      │
│                            │
│  Conteúdo:                 │
│  - Dados do pedido         │
│  - Código de rastreio      │
│  - Link para rastrear      │
└────────────────────────────┘

         ↓ REGISTRA LOG ↓

┌────────────────────────────┐
│  6. SALVA LOG DIALOG       │
│                            │
│  INSERT INTO               │
│  dialog_webhook_logs       │
│  {                         │
│    order_id,               │
│    order_number,           │
│    status_code,            │
│    request_body,           │
│    response_body           │
│  }                         │
└────────────────────────────┘
```

---

## 🎯 MATRIZ DE STATUS

```
┌─────────────────┬────────────────┬──────────────────────────────┐
│ STATUS GATEWAY  │ STATUS NO DB   │ AÇÃO                         │
├─────────────────┼────────────────┼──────────────────────────────┤
│ PENDING         │ pending        │ Aguarda pagamento            │
│ PROCESSING      │ processing     │ Processando confirmação      │
│ PAID            │ paid           │ ✅ ENVIA PARA DIALOG         │
│ REFUSED         │ cancelled      │ Cancela pedido               │
│ REFUNDED        │ refunded       │ Marca como reembolsado       │
│ EXPIRED         │ cancelled      │ Cancela por expiração        │
└─────────────────┴────────────────┴──────────────────────────────┘
```

---

## 💾 ESTRUTURA DO BANCO DE DADOS

```
┌─────────────────────────────────────────────────────────────┐
│                      SUPABASE (PostgreSQL)                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────┐
│   customers     │
├─────────────────┤
│ id (PK)         │───┐
│ name            │   │
│ email           │   │
│ phone           │   │
│ tax_id (CPF)    │   │
│ created_at      │   │
└─────────────────┘   │
                      │
                      │ (1:N)
                      │
┌─────────────────┐   │
│     orders      │   │
├─────────────────┤   │
│ id (PK)         │◄──┘
│ customer_id (FK)│
│ order_number    │───┐
│ status          │   │
│ subtotal        │   │
│ shipping_fee    │   │
│ total           │   │
│ payment_method  │   │
│ payment_status  │   │
│ avenpay_pay_id  │   │
│ shipping_addr   │   │
│ paid_at         │   │
│ created_at      │   │
└─────────────────┘   │
                      │ (1:N)
                      │
┌─────────────────┐   │
│  order_items    │   │
├─────────────────┤   │
│ id (PK)         │◄──┘
│ order_id (FK)   │
│ product_id      │
│ product_name    │
│ product_image   │
│ quantity        │
│ unit_price      │
│ total_price     │
│ created_at      │
└─────────────────┘

┌─────────────────────────┐
│ avenpay_webhook_logs    │
├─────────────────────────┤
│ id (PK)                 │
│ order_id (FK)           │
│ payment_id              │
│ event_type              │
│ status_code             │
│ request_body (JSONB)    │
│ response_body (JSONB)   │
│ error_message           │
│ created_at              │
└─────────────────────────┘

┌─────────────────────────┐
│  dialog_webhook_logs    │
├─────────────────────────┤
│ id (PK)                 │
│ order_id (FK)           │
│ order_number            │
│ status_code             │
│ request_body (JSONB)    │
│ response_body (JSONB)   │
│ error_message           │
│ retry_count             │
│ created_at              │
└─────────────────────────┘
```

---

## 🔄 TIMELINE DE UM PEDIDO

```
t=0s    Cliente clica "Finalizar Compra"
        └─> POST /api/orders/create
        
t=1s    Backend salva no Supabase
        └─> customers (cria/atualiza)
        └─> orders (cria)
        └─> order_items (cria)
        
t=2s    Backend chama Gateway
        └─> POST /v1/payment
        
t=3s    Gateway retorna QR Code
        └─> Backend retorna pro Frontend
        
t=4s    Frontend mostra QR Code
        └─> Cliente vê QR na tela
        
        ⏳ Cliente abre app do banco...
        
t=60s   Cliente paga o PIX
        └─> Gateway confirma no banco
        
t=61s   Gateway envia webhook
        └─> POST /api/webhooks/avenpay
        
t=62s   Backend atualiza status
        └─> UPDATE orders SET status='paid'
        
t=63s   Backend chama DiaLOG
        └─> POST dialog_webhook_url
        
t=65s   DiaLOG processa e envia email
        └─> ✉️ Email enviado pro cliente
        └─> 📦 Código de rastreio gerado
        
✅ PROCESSO COMPLETO (65 segundos)
```

---

## 🎨 EXEMPLO VISUAL DO FLUXO

```
╔══════════════════════════════════════════════════════════════╗
║                    EXEMPLO DE COMPRA REAL                     ║
╚══════════════════════════════════════════════════════════════╝

📱 CLIENTE: João da Silva
📧 EMAIL: joao@email.com
🆔 CPF: 123.456.789-00

🛒 CARRINHO:
   └─ Kit Presente Deleite - R$ 41,60 x 1

🚚 ENTREGA:
   └─ Av. Foz do Iguaçu, 530
      Jardim Terra Rica
      Sinop/MT - 78557-530

💰 TOTAL: R$ 56,60
   └─ Subtotal: R$ 41,60
   └─ Frete: R$ 15,00

─────────────────────────────────────────────────────────────

1️⃣ CRIA PEDIDO
   Order: ORD-1795032114006-35LZ2T
   Status: PENDING
   ✅ Salvo no Supabase

2️⃣ GERA PAGAMENTO
   Payment ID: pay_abc123xyz
   Método: PIX
   ✅ QR Code gerado

3️⃣ MOSTRA QR CODE
   [QR CODE AQUI]
   ⏳ Aguardando pagamento...

4️⃣ CLIENTE PAGA (60s depois)
   ✅ Pagamento confirmado pelo banco

5️⃣ WEBHOOK RECEBIDO
   Status: PAID
   ✅ Pedido atualizado

6️⃣ ENVIADO PARA DIALOG
   ✅ Dados enviados
   📦 Código: BR123456789BR

7️⃣ EMAIL ENVIADO
   Para: joao@email.com
   ✉️ Confirmação + Rastreio
   ✅ Cliente recebeu!

╔══════════════════════════════════════════════════════════════╗
║                    ✅ PROCESSO CONCLUÍDO                      ║
╚══════════════════════════════════════════════════════════════╝
```

---

**Data:** 18/11/2024  
**Arquivo:** DIAGRAMAS_FLUXO.md
