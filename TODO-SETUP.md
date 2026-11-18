# 📋 Setup Checklist - E-commerce O Boticário

## ✅ Concluído

- [x] Banco de dados Supabase criado e configurado
- [x] Credenciais Supabase adicionadas ao .env.local
- [x] @supabase/supabase-js instalado
- [x] Tabelas criadas (customers, orders, order_items, logs)
- [x] Carrinho de compras implementado com localStorage
- [x] Página de checkout completa com formulário
- [x] API /api/orders/create implementada
- [x] Integração Avenpay PIX/Cartão/Boleto
- [x] **Tokenização segura de cartão implementada** (PCI compliant)
- [x] Webhook Avenpay implementado
- [x] Integração DiaLOG automática após pagamento
- [x] Página de confirmação de pedido
- [x] Página de rastreio com widget DiaLOG
- [x] Auto-preenchimento de endereço via ViaCEP

---

## 🔧 Pendente - Você Precisa Fazer

### 1. Adicionar Chaves da Avenpay ⚠️ OBRIGATÓRIO

Abra `.env.local` e adicione suas credenciais:

```env
AVENPAY_API_KEY=sua_chave_secreta_aqui
NEXT_PUBLIC_AVENPAY_TOKENIZATION_KEY=sua_chave_publica_aqui
```

**Importante:**
- `AVENPAY_API_KEY` = Chave **secreta** (backend)
- `NEXT_PUBLIC_AVENPAY_TOKENIZATION_KEY` = Chave **pública** (frontend)

**Onde encontrar:**
- Acesse o painel da Avenpay
- Vá em Configurações → API Keys
- A chave pública é usada para tokenizar cartões no navegador
- A chave secreta processa pagamentos no servidor

### 2️⃣ URL do Webhook DiaLOG (✅ JÁ CONFIGURADA)

A URL do webhook DiaLOG já está configurada no `.env.local`:

```env
DIALOG_WEBHOOK_URL=https://dnpgrcriaqpcybhzikvh.supabase.co/functions/v1/webhook-checkout/universal/c688fd32-379c-425e-a8ad-cc600ad69539?token=d04d15b2b59f4363a9064194ecb413973e46cc80249b43318d6c72f0f9ce93ae
```

**O sistema envia automaticamente quando o pagamento é aprovado:**
- Evento: `payment.paid` da Avenpay
- Webhook envia POST para DiaLOG com dados do pedido
- DiaLOG processa e envia email para o cliente

### 3. Configurar Webhook na Avenpay ⚠️ OBRIGATÓRIO

No painel da Avenpay, configure o webhook para receber notificações:

```
URL: https://seu-dominio.com/api/webhooks/avenpay
```

**Durante desenvolvimento:**
- Use ngrok: `ngrok http 3000`
- Configure a URL do ngrok no painel Avenpay
- Exemplo: `https://abc123.ngrok.io/api/webhooks/avenpay`

### 4. Adicionar CartProvider no _app.jsx ⚠️ OBRIGATÓRIO

O carrinho precisa ser envolvido pela aplicação:

```jsx
// src/pages/_app.jsx
import { CartProvider } from '@/contexts/CartContext';

function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}

export default MyApp;
```

### 5. Adicionar Link de Rastreio no Site 📌 RECOMENDADO

No header ou footer:

```jsx
<Link href="/rastreio">Rastrear Pedido</Link>
```

---

## 🧪 Teste do Fluxo Completo

Após configurar as 3 chaves obrigatórias + CartProvider:

### Teste PIX:
1. ✅ Adicionar produto ao carrinho
2. ✅ Ir para `/checkout`
3. ✅ Preencher dados pessoais e endereço
4. ✅ Escolher **PIX** e finalizar
5. ✅ Ver QR Code na página `/pedido/ORD-xxx`
6. ✅ Pagar PIX usando app do banco
7. ✅ Webhook atualiza pedido → DiaLOG recebe dados → cliente recebe email

### Teste Cartão (com tokenização):
1. ✅ Adicionar produto ao carrinho
2. ✅ Ir para `/checkout`
3. ✅ Escolher **Cartão de Crédito**
4. ✅ Preencher dados (use cartão de teste da Avenpay)
5. ✅ Ao clicar "Finalizar Compra":
   - Frontend tokeniza o cartão automaticamente
   - Envia apenas o token (não os dados reais)
   - Backend processa pagamento com token
6. ✅ Pedido aprovado → DiaLOG recebe dados imediatamente

### Teste Boleto:
1. ✅ Escolher **Boleto Bancário**
2. ✅ Baixar boleto gerado
3. ✅ Simular pagamento (sandbox)
4. ✅ Webhook confirma → DiaLOG recebe dados

---

## 🔐 Como a Tokenização Funciona (Cartões)

### Fluxo de Segurança PCI Compliant:

```
1. Cliente digita dados do cartão
   ↓
2. Script Avenpay tokeniza no navegador
   (número, nome, validade, CVV → TOKEN criptografado)
   ↓
3. Frontend envia APENAS o TOKEN para seu backend
   (dados reais NUNCA passam pelo seu servidor)
   ↓
4. Backend envia TOKEN para Avenpay
   ↓
5. Avenpay processa pagamento com os dados reais
```

**Resultado:** Você nunca manipula dados sensíveis = PCI compliance automático ✅

---

## 📊 Verificar Logs

### No Supabase (SQL Editor):

```sql
-- Ver últimos webhooks Avenpay
SELECT * FROM avenpay_webhook_logs ORDER BY created_at DESC LIMIT 5;

-- Ver últimos webhooks DiaLOG
SELECT * FROM dialog_webhook_logs ORDER BY created_at DESC LIMIT 5;

-- Ver pedidos pagos
SELECT o.*, c.name, c.email 
FROM orders o 
JOIN customers c ON o.customer_id = c.id 
WHERE o.payment_status = 'paid'
ORDER BY o.paid_at DESC;

-- Ver se tokenização está funcionando
SELECT 
  avenpay_payment_id,
  payment_method,
  payment_status,
  request_body->>'payment'->'card'->>'token' as card_token
FROM avenpay_webhook_logs
WHERE request_body->>'payment'->>'method' = 'CREDIT_CARD'
ORDER BY created_at DESC;
```

---

## 🚨 Troubleshooting

### Webhook não chega
- ✅ Verificar URL no painel Avenpay
- ✅ Verificar se ngrok está rodando (se local)
- ✅ Ver logs: `SELECT * FROM avenpay_webhook_logs`

### DiaLOG não recebe pedido
- ✅ Verificar se `DIALOG_WEBHOOK_URL` está configurada
- ✅ Ver logs: `SELECT * FROM dialog_webhook_logs WHERE status_code != 200`
- ✅ Verificar se pedido está "paid"

### Tokenização falhou
- ✅ Verificar se `NEXT_PUBLIC_AVENPAY_TOKENIZATION_KEY` está no .env.local
- ✅ Abrir console do navegador (F12) e verificar erros
- ✅ Verificar se script carregou: `console.log(window.tokenizer)`

### Erro ao criar pedido
- ✅ Verificar credenciais Supabase
- ✅ Verificar se `AVENPAY_API_KEY` está configurada
- ✅ Ver logs do Next.js no terminal

---

## 🎯 Próximos Passos Opcionais

- [ ] Implementar 3D Secure para cartões (ver docs Avenpay)
- [ ] Adicionar cálculo de frete dinâmico (Correios, Jadlog)
- [ ] Criar painel admin para visualizar pedidos
- [ ] Enviar emails de confirmação customizados
- [ ] Adicionar cupons de desconto
- [ ] Sistema de reviews de produtos
- [ ] Controle de estoque
- [ ] Notificações push para acompanhamento

---

**📖 Documentação Completa:** Veja `FINAL-SETUP-GUIDE.md` para guia detalhado

**Precisar de ajuda? Consulte:**
- Documentação Avenpay: https://docs.avenpayments.com
- Documentação Supabase: https://supabase.com/docs
- Contato DiaLOG: através do site oficial
