# 🔧 Integração Avenpay - Projeto Vite + Netlify

## 📋 Situação Atual do Projeto

### Tecnologias Detectadas:
- ✅ **Frontend:** React + Vite (não Next.js)
- ✅ **Deploy:** Netlify Functions
- ✅ **Banco:** Supabase já configurado
- ✅ **Carrinho:** CartProvider já implementado no `App.jsx`
- ⚠️ **Gateway atual:** ZuckPay (precisa migrar para Avenpay)

### Arquivos Já Existentes:
- ✅ `src/App.jsx` - Com CartProvider configurado
- ✅ `netlify/functions/webhook.js` - Webhook ZuckPay atual
- ✅ `src/context/CartContext.jsx` - Contexto do carrinho
- ✅ `.env.local` - **Chaves Avenpay e DiaLOG já configuradas!**

---

## ✅ O Que JÁ Está Pronto

### 1. Variáveis de Ambiente Configuradas (`.env.local`):

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

### 2. Webhook Avenpay Criado:
- ✅ `netlify/functions/webhook-avenpay.js` - Novo webhook criado
- ✅ Integrado com Supabase
- ✅ Envia automaticamente para DiaLOG quando pagamento aprovado
- ✅ Registra logs completos

### 3. CartProvider:
- ✅ Já configurado no `App.jsx`
- ✅ Funcionando perfeitamente

---

## ⚠️ O Que Precisa Ser Feito

### 1. Criar Função Netlify para Criar Pagamentos Avenpay

O projeto tem `netlify/functions/pix.js` que usa ZuckPay. Precisa criar equivalente para Avenpay.

**Criar: `netlify/functions/create-avenpay-payment.js`**

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customer, items, shipping, payment } = req.body;

    // Validações básicas
    if (!customer || !items || !shipping || !payment) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    // Calcular valores
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = 1500; // R$ 15,00 em centavos
    const total = subtotal + shippingFee;

    // Gerar número do pedido único
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // 1. Criar/buscar cliente
    let customerId;
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('tax_id', customer.taxId)
      .single();

    if (existingCustomer) {
      customerId = existingCustomer.id;
      
      await supabase
        .from('customers')
        .update({
          name: customer.name,
          email: customer.email,
          phone: customer.phone
        })
        .eq('id', customerId);
    } else {
      const { data: newCustomer, error } = await supabase
        .from('customers')
        .insert([{
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          tax_id: customer.taxId
        }])
        .select()
        .single();

      if (error) throw error;
      customerId = newCustomer.id;
    }

    // 2. Criar pedido
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        customer_id: customerId,
        order_number: orderNumber,
        status: 'pending',
        subtotal: subtotal,
        shipping_fee: shippingFee,
        total: total,
        currency: 'BRL',
        payment_method: payment.method,
        payment_status: 'pending',
        shipping_address: shipping
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // 3. Criar itens do pedido
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.productId || item.id,
      product_name: item.name,
      product_image: item.image,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 4. Criar pagamento na Avenpay
    const avenpayApiKey = process.env.AVENPAY_API_KEY;
    
    if (!avenpayApiKey) {
      console.error('AVENPAY_API_KEY não configurada');
      return res.status(500).json({ error: 'Configuração de pagamento ausente' });
    }

    const avenpayPayload = {
      amount: total,
      currency: 'BRL',
      method: payment.method,
      description: `Pedido ${orderNumber}`,
      externalRef: orderNumber,
      notificationUrl: `${process.env.URL}/.netlify/functions/webhook-avenpay`,
      payer: {
        name: customer.name,
        taxId: customer.taxId,
        email: customer.email,
        phone: customer.phone
      },
      items: items.map(item => ({
        quantity: item.quantity,
        name: item.name,
        price: item.price,
        type: 'PHYSICAL'
      })),
      delivery: {
        fee: shippingFee,
        address: {
          country: shipping.country || 'BR',
          state: shipping.state,
          city: shipping.city,
          district: shipping.neighborhood,
          street: shipping.street,
          number: shipping.number,
          zipCode: shipping.zipCode
        }
      }
    };

    // Se for cartão, adicionar token
    if (payment.method === 'CREDIT_CARD' && payment.cardToken) {
      avenpayPayload.card = {
        token: payment.cardToken,
        installments: payment.installments || 1,
        chargeInterest: false
      };
    }

    // Chamar API da Avenpay
    const avenpayResponse = await fetch('https://api.avenpayments.com/v1/payment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${avenpayApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(avenpayPayload)
    });

    const avenpayData = await avenpayResponse.json();

    if (!avenpayResponse.ok) {
      console.error('Erro Avenpay:', avenpayData);
      throw new Error(avenpayData.message || 'Erro ao criar pagamento');
    }

    // 5. Atualizar pedido com ID do pagamento
    await supabase
      .from('orders')
      .update({
        avenpay_payment_id: avenpayData.id,
        payment_status: avenpayData.status === 'PAID' ? 'paid' : 'pending'
      })
      .eq('id', order.id);

    // 6. Registrar log
    await supabase
      .from('avenpay_webhook_logs')
      .insert([{
        order_id: order.id,
        payment_id: avenpayData.id,
        event_type: 'payment.created',
        status_code: avenpayResponse.status,
        request_body: avenpayPayload,
        response_body: avenpayData
      }]);

    // 7. Retornar resposta
    return res.status(200).json({
      success: true,
      orderNumber: orderNumber,
      orderId: order.id,
      paymentId: avenpayData.id,
      paymentData: avenpayData.data, // QR Code PIX, link boleto, etc
      paymentStatus: avenpayData.status
    });

  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return res.status(500).json({
      error: 'Erro ao processar pedido',
      message: error.message
    });
  }
}
```

### 2. Atualizar Componente Checkout (React)

O arquivo `src/pages/Checkout.jsx` atual está usando imports do Next.js. Precisa adaptar para React puro.

**Principais mudanças:**
- ❌ Remover: `import { useRouter } from 'next/router'`
- ✅ Usar: `import { useNavigate } from 'react-router-dom'`
- ❌ Remover: `import Head from 'next/head'`
- ❌ Remover: `import Script from 'next/script'`
- ✅ Usar: `<Helmet>` do `react-helmet` OU adicionar script no `index.html`
- ✅ Trocar `router.push()` por `navigate()`
- ✅ Usar variáveis de ambiente: `import.meta.env.VITE_...` ao invés de `process.env.NEXT_PUBLIC_...`

### 3. Configurar Variáveis no Netlify

As variáveis do `.env.local` precisam ser adicionadas no painel do Netlify:

1. Acesse **Netlify Dashboard** → Seu site → **Site settings** → **Environment variables**

2. Adicione:
```
NEXT_PUBLIC_SUPABASE_URL=https://onscojkssuytbqzqgafu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_HAeCbLMh1pRPOhPoOklOoA_tYAdQ4x2pRE
SUPABASE_SERVICE_ROLE_KEY=sb_secret_K85-EleZGXPbBRyE_H3SMQ_LnCge1_j
AVENPAY_API_KEY=d_5SKkAF0pnKaSJ0OLKrsPdbr9LRcw8Qyox6Kz1keXw
NEXT_PUBLIC_AVENPAY_TOKENIZATION_KEY=XgyrLYl000r9gv4BDro6puMrTtLBS3mfmwG2HNH6NjY
DIALOG_WEBHOOK_URL=https://dnpgrcriaqpcybhzikvh.supabase.co/functions/v1/webhook-checkout/universal/c688fd32-379c-425e-a8ad-cc600ad69539?token=d04d15b2b59f4363a9064194ecb413973e46cc80249b43318d6c72f0f9ce93ae
```

3. **Deploy** novamente

### 4. Configurar Webhook no Painel Avenpay

URL do webhook: 
```
https://seu-site.netlify.app/.netlify/functions/webhook-avenpay
```

---

## 🚀 Fluxo de Integração Completo

```
1. Cliente faz checkout no React
    ↓
2. Frontend chama: POST /.netlify/functions/create-avenpay-payment
    ↓
3. Netlify Function:
   - Cria cliente no Supabase
   - Cria pedido no Supabase
   - Chama Avenpay API
   - Retorna QR Code PIX (ou boleto/cartão)
    ↓
4. Cliente paga
    ↓
5. Avenpay detecta pagamento
    ↓
6. Avenpay chama: POST /.netlify/functions/webhook-avenpay
    ↓
7. Webhook atualiza pedido (status: paid)
    ↓
8. Webhook envia para DiaLOG automaticamente
    ↓
9. DiaLOG cria tracking + envia email
```

---

## 📋 Checklist

### ✅ Já Feito:
- [x] Chaves Avenpay adicionadas no `.env.local`
- [x] DiaLOG URL configurada no `.env.local`
- [x] CartProvider já está no `App.jsx`
- [x] Webhook Avenpay criado (`netlify/functions/webhook-avenpay.js`)
- [x] Integração DiaLOG implementada no webhook

### ⚠️ Precisa Fazer:
- [ ] Criar `netlify/functions/create-avenpay-payment.js`
- [ ] Atualizar `src/pages/Checkout.jsx` para React (remover Next.js)
- [ ] Adicionar variáveis de ambiente no painel Netlify
- [ ] Configurar webhook URL no painel Avenpay
- [ ] Testar fluxo completo

---

## 🔧 Como Testar Localmente

### 1. Instalar Netlify CLI:
```bash
npm install -g netlify-cli
```

### 2. Rodar localmente:
```bash
netlify dev
```

Isso roda o Vite + Netlify Functions juntos.

### 3. Testar pagamento:
- Frontend roda em: `http://localhost:8888`
- Functions rodam em: `http://localhost:8888/.netlify/functions/...`

### 4. Usar ngrok para receber webhooks:
```bash
ngrok http 8888
```

Configure no painel Avenpay:
```
https://abc123.ngrok.io/.netlify/functions/webhook-avenpay
```

---

## 📚 Próximos Passos

1. **Curto Prazo:**
   - Implementar `create-avenpay-payment.js`
   - Adaptar `Checkout.jsx` para React puro
   - Adicionar script de tokenização Avenpay no `index.html`

2. **Médio Prazo:**
   - Página de confirmação de pedido (`/pedido/:orderNumber`)
   - Melhorar página de rastreio (já existe `/rastreio`)
   - Adicionar loading states

3. **Longo Prazo:**
   - Painel admin para visualizar pedidos
   - Sistema de notificações
   - Retry automático para webhooks DiaLOG que falharem

---

## 🆘 Precisa de Ajuda?

**Documentação criada:**
- `RESUMO-FINAL.md` - Overview do sistema
- `TESTE-DIALOG.md` - Como testar DiaLOG
- `FINAL-SETUP-GUIDE.md` - Guia detalhado

**Suporte:**
- Avenpay: https://docs.avenpayments.com
- Netlify Functions: https://docs.netlify.com/functions/overview/
- Supabase: https://supabase.com/docs

---

✅ **Chaves configuradas! Agora é criar as funções Netlify e adaptar o Checkout para React.**
