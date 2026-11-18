# 🚀 Setup Avenpay + DiaLOG - Vercel

## ✅ O Que Já Está Pronto

### 1. Chaves Configuradas no `.env.local`:

```env
# Supabase ✅
NEXT_PUBLIC_SUPABASE_URL=https://onscojkssuytbqzqgafu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_HAeCbLMh1pRPOhPoOklOoA_tYAdQ4x2pRE
SUPABASE_SERVICE_ROLE_KEY=sb_secret_K85-EleZGXPbBRyE_H3SMQ_LnCge1_j

# Avenpay ✅
AVENPAY_API_KEY=d_5SKkAF0pnKaSJ0OLKrsPdbr9LRcw8Qyox6Kz1keXw
NEXT_PUBLIC_AVENPAY_TOKENIZATION_KEY=XgyrLYl000r9gv4BDro6puMrTtLBS3mfmwG2HNH6NjY

# DiaLOG ✅
DIALOG_WEBHOOK_URL=https://dnpgrcriaqpcybhzikvh.supabase.co/functions/v1/webhook-checkout/universal/c688fd32-379c-425e-a8ad-cc600ad69539?token=d04d15b2b59f4363a9064194ecb413973e46cc80249b43318d6c72f0f9ce93ae
```

### 2. APIs Vercel Criadas:

- ✅ `api/orders/create.js` - Criar pedido + chamar Avenpay
- ✅ `api/webhooks/avenpay.js` - Receber confirmações + enviar para DiaLOG

### 3. Banco de Dados:

- ✅ Supabase configurado
- ✅ 5 tabelas criadas (customers, orders, order_items, avenpay_webhook_logs, dialog_webhook_logs)

---

## 🔧 Configuração Vercel (3 Passos)

### Passo 1: Adicionar Variáveis de Ambiente

1. Acesse: **https://vercel.com/dashboard**
2. Selecione seu projeto
3. Vá em: **Settings** → **Environment Variables**
4. Adicione todas as variáveis do `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://onscojkssuytbqzqgafu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_HAeCbLMh1pRPOhPoOklOoA_tYAdQ4x2pRE
SUPABASE_SERVICE_ROLE_KEY=sb_secret_K85-EleZGXPbBRyE_H3SMQ_LnCge1_j
AVENPAY_API_KEY=d_5SKkAF0pnKaSJ0OLKrsPdbr9LRcw8Qyox6Kz1keXw
NEXT_PUBLIC_AVENPAY_TOKENIZATION_KEY=XgyrLYl000r9gv4BDro6puMrTtLBS3mfmwG2HNH6NjY
DIALOG_WEBHOOK_URL=https://dnpgrcriaqpcybhzikvh.supabase.co/functions/v1/webhook-checkout/universal/c688fd32-379c-425e-a8ad-cc600ad69539?token=d04d15b2b59f4363a9064194ecb413973e46cc80249b43318d6c72f0f9ce93ae
```

**Importante:** Selecione **Production, Preview, Development** para todas as variáveis.

### Passo 2: Fazer Deploy

```bash
git add .
git commit -m "Adicionar integração Avenpay + DiaLOG"
git push
```

Ou no painel Vercel: **Deployments** → **Redeploy**

### Passo 3: Configurar Webhook na Avenpay

Após o deploy, pegue a URL do seu site:

```
https://seu-site.vercel.app/api/webhooks/avenpay
```

**Configure no painel Avenpay:**
1. Acesse: Configurações → Webhooks
2. Cole a URL acima
3. Salve

---

## 🧪 Testar Localmente (Antes do Deploy)

### 1. Rodar projeto local:

```bash
npm run dev
```

### 2. Expor localhost com ngrok:

```bash
# Instalar ngrok: https://ngrok.com/download
ngrok http 5173
```

### 3. Configurar webhook temporário:

Na Avenpay, use a URL do ngrok:
```
https://abc123.ngrok.io/api/webhooks/avenpay
```

### 4. Fazer um pedido de teste:

1. Adicione produto ao carrinho
2. Vá para `/checkout`
3. Preencha seus dados
4. Escolha **PIX**
5. Finalize
6. Pague o PIX
7. Aguarde 10 segundos
8. **Você receberá email da DiaLOG!**

---

## 📂 Estrutura das APIs Vercel

```
api/
├── orders/
│   └── create.js          # POST /api/orders/create
│                          # - Recebe dados do checkout
│                          # - Cria pedido no Supabase
│                          # - Chama Avenpay API
│                          # - Retorna QR Code PIX / Boleto / Status Cartão
│
└── webhooks/
    └── avenpay.js         # POST /api/webhooks/avenpay
                           # - Recebe webhook Avenpay
                           # - Atualiza status do pedido
                           # - Envia para DiaLOG (se PAID)
```

---

## 🔄 Fluxo Completo de Pagamento

```
1. Cliente finaliza checkout no React
    ↓
2. Frontend chama: POST /api/orders/create
    {
      customer: { name, email, phone, taxId },
      items: [{ id, name, price, quantity }],
      shipping: { zipCode, street, number, city, state },
      payment: { method: 'PIX' }
    }
    ↓
3. API Vercel:
   a) Cria/atualiza customer no Supabase
   b) Cria order (status: pending)
   c) Cria order_items
   d) Chama Avenpay: POST https://api.avenpayments.com/v1/payment
   e) Retorna QR Code PIX
    ↓
4. Cliente paga o PIX no app do banco
    ↓
5. Avenpay detecta pagamento confirmado
    ↓
6. Avenpay chama: POST https://seu-site.vercel.app/api/webhooks/avenpay
    {
      id: 'pay_xxx',
      status: 'PAID',
      externalRef: 'ORD-1234567890-ABC123',
      amount: 15000,
      ...
    }
    ↓
7. Webhook API:
   a) Atualiza order (payment_status: 'paid', paid_at: now)
   b) Registra log em avenpay_webhook_logs
   c) Chama sendToDialog()
    ↓
8. sendToDialog():
   a) Monta payload com dados do pedido
   b) POST para DIALOG_WEBHOOK_URL
   c) DiaLOG cria código de rastreio
   d) DiaLOG envia email para cliente
   e) Registra log em dialog_webhook_logs
    ↓
9. Cliente recebe email com código de rastreio
    ↓
10. Cliente acessa /rastreio e vê status da entrega
```

---

## 🎨 Como Chamar as APIs no Frontend

### Criar Pedido (no Checkout):

```javascript
// src/pages/Checkout.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const orderData = {
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        taxId: formData.taxId
      },
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: Math.round(item.price * 100), // converter para centavos
        quantity: item.quantity,
        image: item.image
      })),
      shipping: {
        zipCode: formData.zipCode,
        street: formData.street,
        number: formData.number,
        complement: formData.complement,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        country: 'BR'
      },
      payment: {
        method: paymentMethod, // 'PIX' ou 'CREDIT_CARD' ou 'BOLETO'
        installments: paymentMethod === 'CREDIT_CARD' ? parseInt(formData.installments) : 1
      }
    };

    // Se for cartão, tokenizar
    if (paymentMethod === 'CREDIT_CARD') {
      const cardToken = await window.tokenizer.encrypt({
        number: formData.cardNumber.replace(/\s/g, ''),
        holder: formData.cardHolder,
        exp_month: formData.cardExpMonth,
        exp_year: formData.cardExpYear,
        cvv: formData.cardCvv
      });
      
      orderData.payment.cardToken = cardToken;
    }

    // Chamar API Vercel
    const response = await fetch('/api/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();

    if (response.ok) {
      clearCart();
      
      // Redirecionar para página de confirmação
      navigate(`/pedido/${result.orderNumber}`, {
        state: {
          paymentData: result.paymentData,
          paymentMethod: paymentMethod
        }
      });
    } else {
      alert(`Erro: ${result.error || 'Tente novamente'}`);
    }
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    alert('Erro ao processar pedido. Tente novamente.');
  } finally {
    setLoading(false);
  }
};
```

---

## 🔐 Tokenização do Cartão (Frontend)

Adicione no `index.html` (antes do `</body>`):

```html
<script>
  // Carregar script Avenpay
  const script = document.createElement('script');
  script.src = 'https://api.avenpayments.com/v1/scripts';
  script.onload = () => {
    // Inicializar tokenizer
    if (window.tokenizer && import.meta.env.VITE_AVENPAY_TOKENIZATION_KEY) {
      window.tokenizer.init(import.meta.env.VITE_AVENPAY_TOKENIZATION_KEY);
      console.log('✅ Tokenizer Avenpay inicializado');
    }
  };
  document.head.appendChild(script);
</script>
```

**Importante:** Para Vite, as variáveis devem começar com `VITE_`:

Renomeie no `.env.local`:
```env
# Mudar de:
NEXT_PUBLIC_AVENPAY_TOKENIZATION_KEY=XgyrLYl000r9gv4BDro6puMrTtLBS3mfmwG2HNH6NjY

# Para:
VITE_AVENPAY_TOKENIZATION_KEY=XgyrLYl000r9gv4BDro6puMrTtLBS3mfmwG2HNH6NjY
```

E use no código:
```javascript
import.meta.env.VITE_AVENPAY_TOKENIZATION_KEY
```

---

## 📊 Monitorar Logs

### No Supabase (SQL Editor):

```sql
-- Ver últimos pedidos
SELECT 
  o.order_number,
  o.created_at,
  o.payment_status,
  c.name,
  c.email,
  o.total / 100.0 as total_reais
FROM orders o
JOIN customers c ON o.customer_id = c.id
ORDER BY o.created_at DESC
LIMIT 10;
```

```sql
-- Ver webhooks Avenpay recebidos
SELECT 
  created_at,
  payment_id,
  event_type,
  request_body->>'status' as status,
  status_code
FROM avenpay_webhook_logs
ORDER BY created_at DESC
LIMIT 10;
```

```sql
-- Ver envios para DiaLOG
SELECT 
  created_at,
  order_number,
  status_code,
  response_body->>'tracking_code' as tracking_code,
  error_message
FROM dialog_webhook_logs
ORDER BY created_at DESC
LIMIT 10;
```

### Nos Logs da Vercel:

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em: **Deployments** → Última deployment → **Functions**
4. Clique em uma função para ver logs em tempo real

---

## ✅ Checklist Final

### Deploy:
- [ ] Variáveis adicionadas no painel Vercel
- [ ] Código commitado e push feito
- [ ] Deploy concluído com sucesso
- [ ] Webhook URL configurada na Avenpay

### Teste:
- [ ] Fazer pedido de teste com seu email
- [ ] Pagar PIX
- [ ] Verificar logs no Supabase
- [ ] Confirmar que DiaLOG recebeu (status_code 200)
- [ ] Receber email com código de rastreio
- [ ] Testar rastreio em `/rastreio`

---

## 🚨 Troubleshooting

### Erro 500 na API
```bash
# Ver logs da Vercel
vercel logs seu-site-url
```

### Webhook não chega
```bash
# Verificar URL configurada na Avenpay
# Testar manualmente com curl:
curl -X POST https://seu-site.vercel.app/api/webhooks/avenpay \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Event: payment.paid" \
  -d '{
    "id": "pay_test",
    "status": "PAID",
    "externalRef": "ORD-TEST-123",
    "amount": 10000
  }'
```

### DiaLOG não recebe
```sql
-- Ver erro específico
SELECT 
  order_number,
  status_code,
  error_message,
  response_body
FROM dialog_webhook_logs
WHERE status_code != 200 OR status_code IS NULL
ORDER BY created_at DESC;
```

---

## 🎉 Próximos Passos

Após o sistema funcionar:

1. **Melhorar UX:**
   - Página de confirmação bonita (`/pedido/:orderNumber`)
   - Loading states
   - Mensagens de erro amigáveis

2. **Adicionar Recursos:**
   - Painel admin para ver pedidos
   - Notificações por email customizadas
   - Sistema de cupons de desconto

3. **Otimizar:**
   - Retry automático para webhooks DiaLOG
   - Cache de produtos
   - Compressão de imagens

---

**Tudo pronto! Agora é só fazer deploy e testar 🚀**

URLs importantes:
- API criar pedido: `https://seu-site.vercel.app/api/orders/create`
- Webhook Avenpay: `https://seu-site.vercel.app/api/webhooks/avenpay`
