# 🎯 MELHORIAS: Event Match Quality (EMQ) do Meta

## ❌ Problema Identificado pelo Meta

O Meta reportou que as vendas não estão sendo atribuídas corretamente porque:

1. **EMQ baixo (5.7)** - Qualidade dos dados abaixo do ideal
2. **Cobertura de eventos 0%** - Vendas não sendo atribuídas às campanhas
3. **Falta parâmetro `fbc`** (Facebook Click ID) - 0% de cobertura
4. **Falta Correspondência Avançada Automática** (Advanced Matching)
5. **Falta `event_id` consistente** para deduplicação

---

## ✅ Melhorias Implementadas

### 1️⃣ **Advanced Matching Automático**

Agora o site captura e hasheia automaticamente os dados do cliente:

**Dados capturados e hasheados (SHA-256):**
- ✅ Email (`em`)
- ✅ Telefone (`ph`)
- ✅ Primeiro nome (`fn`)
- ✅ Último nome (`ln`)
- ✅ Cidade (`ct`)
- ✅ Estado (`st`)
- ✅ CEP (`zp`)
- ✅ País (`country` - sempre BR)

**Arquivo:** `src/services/metaPixel.js`

```javascript
// Configura Advanced Matching automaticamente no checkout
await setAdvancedMatching({
  email: formData.email,
  phone: formData.phone,
  name: formData.name,
  city: formData.city,
  state: formData.state,
  cep: formData.cep
})
```

---

### 2️⃣ **Captura de `fbc` e `fbp`**

**`fbc` (Facebook Click ID):**
- Capturado automaticamente da URL quando o usuário clica no anúncio
- Parâmetro: `fbclid` na URL
- Formato: `fb.1.timestamp.fbclid`
- Salvo no cookie `_fbc`

**`fbp` (Facebook Browser ID):**
- Gerado automaticamente pelo Meta Pixel
- Salvo no cookie `_fbp`
- Identifica o navegador do usuário

**Arquivo:** `src/services/metaPixel.js`

```javascript
// Captura fbc e fbp automaticamente
const fbc = getFbcParam() // Pega da URL ou cookie
const fbp = getFbpParam() // Pega do cookie
```

---

### 3️⃣ **Event ID para Deduplicação**

Agora todos os eventos `Purchase` são enviados com um `event_id` único:

**Browser (Meta Pixel):**
```javascript
window.fbq('track', 'Purchase', purchaseData, {
  eventID: orderId // Usa orderId como event_id único
})
```

**Servidor (Conversions API):**
```javascript
{
  event_id: orderId, // Mesmo event_id do browser
  event_name: 'Purchase',
  // ...
}
```

Isso garante que a mesma venda não seja contada duas vezes.

---

### 4️⃣ **Conversions API Melhorada**

A Conversions API agora envia **MUITO MAIS DADOS**:

**Dados enviados:**
- ✅ Email (hasheado)
- ✅ Telefone (hasheado)
- ✅ Nome completo (hasheado)
- ✅ País (hasheado)
- ✅ `fbc` (Facebook Click ID) - **NÃO hasheado**
- ✅ `fbp` (Facebook Browser ID) - **NÃO hasheado**
- ✅ IP do cliente
- ✅ User Agent do navegador
- ✅ `event_id` para deduplicação

**Arquivo:** `api/webhook-zuckpay.js`

---

### 5️⃣ **Fluxo Completo de Rastreamento**

#### **Passo 1: Usuário clica no anúncio**
```
https://revendas-do-boti.vercel.app/?fbclid=ABC123&utm_source=facebook&utm_campaign=kits
```
- ✅ `fbclid` é capturado e salvo como `fbc`
- ✅ Meta Pixel gera `fbp` automaticamente
- ✅ UTMs são salvas no localStorage

#### **Passo 2: Usuário preenche checkout**
- ✅ Advanced Matching é configurado com dados do cliente (hasheados)
- ✅ `fbc` e `fbp` são capturados dos cookies
- ✅ Dados são enviados para criar o PIX

#### **Passo 3: PIX é criado**
- ✅ `fbc` e `fbp` são salvos na descrição do PIX
- ✅ UTMs são salvas na descrição do PIX
- ✅ Tudo fica armazenado para recuperar no webhook

#### **Passo 4: Cliente paga o PIX**
- ✅ Webhook é chamado pela ZuckPay
- ✅ `fbc`, `fbp` e UTMs são extraídos da descrição
- ✅ Evento `Purchase` é disparado para:
  - **Utmify** (com UTMs)
  - **Meta Conversions API** (com todos os dados)

---

## 🔧 CONFIGURAÇÃO NECESSÁRIA

### ⚠️ Token da Meta Conversions API

Para a Conversions API funcionar, você precisa configurar o token de acesso:

#### **1. Gerar o Token no Meta Business:**

1. Acesse: https://business.facebook.com/
2. Vá em **Configurações do Negócio**
3. Clique em **Gerenciador de Eventos**
4. Selecione seu Pixel (996548406361699)
5. Vá em **Configurações**
6. Role até **Conversions API**
7. Clique em **Gerar Token de Acesso**
8. Copie o token gerado

#### **2. Adicionar no Vercel:**

1. Acesse: https://vercel.com/
2. Vá no seu projeto
3. Clique em **Settings**
4. Clique em **Environment Variables**
5. Adicione uma nova variável:
   - **Name:** `META_CONVERSION_API_TOKEN`
   - **Value:** Cole o token que você copiou
   - **Environment:** Production, Preview, Development (marque todos)
6. Clique em **Save**
7. Faça um novo deploy (ou espere o próximo push)

---

## 📊 Resultados Esperados

### Antes (EMQ 5.7):
- ❌ Cobertura de eventos: 0%
- ❌ fbc: 0%
- ❌ Advanced Matching: Não configurado
- ❌ Vendas não atribuídas

### Depois (EMQ esperado: 8.0+):
- ✅ Cobertura de eventos: 80%+
- ✅ fbc: 80%+ (quando usuário vem do anúncio)
- ✅ fbp: 100%
- ✅ Advanced Matching: 8 parâmetros
- ✅ Vendas atribuídas corretamente
- ✅ Deduplicação funcionando

---

## 🧪 Como Testar

### 1. Teste com anúncio real:

1. Crie um anúncio no Meta
2. Use o link com UTMs:
```
https://revendas-do-boti.vercel.app/?utm_source=facebook&utm_medium=cpc&utm_campaign=teste-emq
```

3. **IMPORTANTE:** Clique no anúncio (não acesse direto)
4. Faça uma compra de teste
5. Pague o PIX

### 2. Verifique no Meta:

1. Acesse o **Gerenciador de Eventos**
2. Vá em **Test Events** (Eventos de Teste)
3. Procure pelo evento `Purchase`
4. Verifique o **Event Match Quality (EMQ)**
5. Deve mostrar:
   - ✅ Email: ✓
   - ✅ Phone: ✓
   - ✅ First Name: ✓
   - ✅ Last Name: ✓
   - ✅ City: ✓
   - ✅ State: ✓
   - ✅ Zip: ✓
   - ✅ Country: ✓
   - ✅ fbc: ✓ (se veio do anúncio)
   - ✅ fbp: ✓

### 3. Verifique os logs:

Abra o Console (F12) e procure por:
```
[Meta Pixel] Advanced Matching configurado: ['em', 'ph', 'fn', 'ln', 'ct', 'st', 'zp', 'country']
[Checkout] fbc capturado: fb.1.1234567890.ABC123
[Checkout] fbp capturado: fb.1.1234567890.XYZ789
[Meta Pixel] fbc adicionado: fb.1.1234567890.ABC123
[Meta Pixel] fbp adicionado: fb.1.1234567890.XYZ789
[Meta Pixel] ✅ Purchase enviado com event_id: ORD-1234567890
```

---

## 📈 Impacto Esperado

Com essas melhorias, você deve ver:

1. **EMQ aumentar de 5.7 para 8.0+**
2. **Cobertura de eventos aumentar de 0% para 80%+**
3. **Vendas sendo atribuídas corretamente às campanhas**
4. **Melhor otimização dos anúncios pelo Meta**
5. **Redução do CPA (Custo por Aquisição)**
6. **Aumento do ROAS (Return on Ad Spend)**

---

## 🚨 Checklist

Antes de rodar anúncios, verifique:

- [ ] Token da Meta Conversions API configurado no Vercel
- [ ] Novo deploy feito após adicionar o token
- [ ] Teste de compra realizado clicando em um anúncio
- [ ] EMQ verificado no Gerenciador de Eventos
- [ ] Evento Purchase aparecendo no Meta
- [ ] fbc e fbp sendo capturados (verificar logs)
- [ ] Advanced Matching configurado (verificar logs)

---

## 💡 Dicas

- **Sempre use links com UTMs** nos anúncios
- **Sempre clique no anúncio** para testar (não acesse direto)
- **Verifique o EMQ** regularmente no Gerenciador de Eventos
- **Monitore a cobertura de eventos** no Meta
- **Use o Test Events** para validar antes de escalar

---

## 📞 Suporte

Se o EMQ ainda estiver baixo após essas melhorias:

1. Verifique se o token da Meta está configurado
2. Verifique os logs do webhook no Vercel
3. Verifique se o fbc está sendo capturado (só funciona se clicar no anúncio)
4. Me chama que eu te ajudo! 🚀

---

**Com essas melhorias, seu EMQ deve subir significativamente e as vendas devem começar a ser atribuídas corretamente!** ✅
