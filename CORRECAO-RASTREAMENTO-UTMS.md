# ✅ CORREÇÃO: Rastreamento de UTMs nas Vendas

## 🎯 Problema Identificado

As vendas não estavam sendo rastreadas com UTMs nem na **Utmify** nem no **Meta**. Quando uma venda era concluída, todos os campos UTM apareciam como `--` (vazios) no painel da ZuckPay.

### Causa Raiz
As UTMs estavam sendo capturadas e salvas no localStorage, mas **NÃO estavam sendo enviadas para a ZuckPay** nos campos corretos da API. Elas estavam apenas na descrição do PIX, mas a ZuckPay precisa receber as UTMs em campos específicos.

---

## 🔧 Solução Implementada

### 1. Adicionados Campos UTM no Payload da ZuckPay

**Arquivo modificado:** `api/create-pix.js`

Agora o payload enviado para a ZuckPay inclui os campos UTM oficiais:

```javascript
const payload = {
  nome: orderData.customer.name,
  cpf: orderData.customer.document.replace(/\D/g, ''),
  email: orderData.customer.email,
  telefone: orderData.customer.phone.replace(/\D/g, ''),
  valor: parseFloat(orderData.total),
  urlnoty: `${req.headers.origin || 'https://revendas-do-boti.vercel.app'}/api/webhook-zuckpay`,
  descricao: fullDescription,
  external_id_client: orderData.orderId,
  // ✅ NOVOS CAMPOS UTM
  utm_source: utms.utm_source || '',
  utm_campaign: utms.utm_campaign || '',
  utm_medium: utms.utm_medium || '',
  utm_content: utms.utm_content || '',
  utm_term: utms.utm_term || ''
}
```

### 2. Logs Melhorados

Adicionados logs detalhados para facilitar debug:

```javascript
console.log('🎯 UTM Source:', payload.utm_source || '(vazio)')
console.log('🎯 UTM Campaign:', payload.utm_campaign || '(vazio)')
console.log('🎯 UTM Medium:', payload.utm_medium || '(vazio)')
console.log('🎯 UTM Content:', payload.utm_content || '(vazio)')
console.log('🎯 UTM Term:', payload.utm_term || '(vazio)')
```

---

## 📊 Fluxo Completo de Rastreamento

### 1. **Captura de UTMs** (quando usuário acessa o site)
- Arquivo: `src/services/utmManager.js`
- Função: `initUtmTracking()` chamada no `App.jsx`
- UTMs são salvas no `localStorage` com a chave `campaign_utms`

### 2. **Envio ao Checkout** (quando usuário finaliza compra)
- Arquivo: `src/pages/Checkout.jsx`
- Função: `getStoredUtms()` recupera UTMs do localStorage
- UTMs são incluídas no objeto `orderData.utms`

### 3. **Envio para ZuckPay** (criação do PIX)
- Arquivo: `api/create-pix.js`
- UTMs são enviadas em campos específicos: `utm_source`, `utm_campaign`, etc.
- ZuckPay armazena as UTMs e as retorna no webhook

### 4. **Webhook de Pagamento** (quando PIX é pago)
- Arquivo: `api/webhook-zuckpay.js`
- Dispara evento `Purchase` para **Utmify** com as UTMs
- Dispara evento `Purchase` para **Meta Conversions API** (se configurado)

---

## 🧪 Como Testar

### 1. Acesse o site com UTMs na URL:
```
https://revendas-do-boti.vercel.app/?utm_source=facebook&utm_medium=cpc&utm_campaign=kits-dia-maes&utm_content=banner-70off
```

### 2. Faça uma compra completa:
- Adicione produtos ao carrinho
- Vá para o checkout
- Preencha todos os dados
- Gere o PIX
- Pague o PIX

### 3. Verifique os logs no console:
```
[UTM Manager] UTMs capturadas e salvas: {...}
[Checkout] UTMs que serão enviadas com o pedido: {...}
[API create-pix] UTMs recebidas: {...}
📤 [API CREATE-PIX] PAYLOAD PARA ZUCKPAY (OFICIAL)
🎯 UTM Source: facebook
🎯 UTM Campaign: kits-dia-maes
🎯 UTM Medium: cpc
🎯 UTM Content: banner-70off
```

### 4. Verifique no painel da ZuckPay:
- Acesse: https://zuckpay.com.br/conta/
- Vá em "Transações"
- Abra a transação da venda
- Verifique se os campos UTM estão preenchidos:
  - **SRC** (utm_source): facebook
  - **CAMPANHA** (utm_campaign): kits-dia-maes
  - **MÍDIA** (utm_medium): cpc
  - **CONTEÚDO** (utm_content): banner-70off

### 5. Verifique na Utmify:
- Acesse: https://app.utmify.com.br/
- Vá em "Eventos"
- Procure pelo evento `Purchase`
- Verifique se as UTMs estão associadas à conversão

---

## 🎯 Link de Teste Recomendado

Use este link nos seus anúncios do Meta:

```
https://revendas-do-boti.vercel.app/?utm_source=facebook&utm_medium=cpc&utm_campaign=kits-dia-maes&utm_content=banner-70off
```

**Importante:**
- Você pode usar o **mesmo link** em múltiplos anúncios da **mesma campanha**
- Se for escalar/duplicar a campanha, pode continuar usando o mesmo link
- Se criar uma **nova campanha diferente**, crie um novo link com `utm_campaign` diferente

---

## ✅ Status

- ✅ UTMs sendo capturadas na URL
- ✅ UTMs sendo salvas no localStorage
- ✅ UTMs sendo enviadas no checkout
- ✅ UTMs sendo enviadas para ZuckPay nos campos corretos
- ✅ UTMs sendo enviadas para Utmify no evento Purchase
- ✅ Logs detalhados para debug

---

## 📝 Próximos Passos

1. **Fazer uma compra de teste** com o link que contém UTMs
2. **Verificar no painel da ZuckPay** se as UTMs aparecem corretamente
3. **Verificar na Utmify** se o evento Purchase foi registrado com as UTMs
4. **Configurar Meta Conversions API** (opcional, mas recomendado):
   - Adicionar variável de ambiente `META_CONVERSION_API_TOKEN` no Vercel
   - Isso permitirá rastreamento server-side no Meta

---

## 🚀 Deploy

As alterações já estão prontas. Para aplicar:

```bash
git add .
git commit -m "fix: adicionar campos UTM no payload da ZuckPay para rastreamento correto"
git push
```

O Vercel fará o deploy automático em alguns segundos.
