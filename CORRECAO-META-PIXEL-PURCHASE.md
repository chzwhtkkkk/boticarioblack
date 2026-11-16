# 🎯 Correção: Meta Pixel - InitiateCheckout e Purchase Events

## 📋 PROBLEMA IDENTIFICADO

O Facebook estava relatando que **não estava recebendo eventos de compra (Purchase)** do site.

### Por que isso acontecia?

**Comportamento ANTERIOR:**
- Não tinha NENHUM evento de conversão sendo disparado
- Facebook não conseguia otimizar as campanhas
- Impossível rastrear o funil de vendas

---

## ✅ SOLUÇÃO IMPLEMENTADA (PADRÃO FACEBOOK + ZUCKPAY)

Implementamos a **estratégia recomendada** pelo Facebook e ZuckPay:

### 🎯 2 EVENTOS DISTINTOS:

#### 1. **`InitiateCheckout`** → Quando gera o PIX
- Dispara no **Checkout.jsx** após PIX ser gerado com sucesso
- Indica que o cliente completou o checkout
- Útil para rastrear abandono de PIX

#### 2. **`Purchase`** → Quando o PIX é PAGO
- Dispara no **OrderSuccess.jsx** quando status = 'paid'
- Conversão real confirmada
- Usado para otimizar campanhas de vendas

---

## 🔄 FLUXO COMPLETO DE EVENTOS

```
Cliente navega no site
    ↓
PageView (automático)
    ↓
ViewContent (ao ver produto)
    ↓
AddToCart (ao adicionar no carrinho)
    ↓
🆕 InitiateCheckout (ao gerar PIX) ← NOVO
    ↓
[Cliente paga o PIX]
    ↓
🆕 Purchase (PIX confirmado) ← NOVO
```

---

## 📝 MUDANÇAS IMPLEMENTADAS

### 1. **Checkout.jsx** - Dispara InitiateCheckout
```javascript
// Após gerar o PIX com sucesso:
trackInitiateCheckout(cart, totalWithShipping)
```

**Quando dispara:** Logo após o PIX ser gerado pela API ZuckPay

**Dados enviados:**
- `content_ids` - IDs dos produtos
- `contents` - Detalhes de cada item (ID, quantidade, preço)
- `value` - Valor total (incluindo frete)
- `currency` - 'BRL'
- `num_items` - Quantidade total de itens

### 2. **OrderSuccess.jsx** - Dispara Purchase (quando PAGO)
```javascript
// Quando PIX é confirmado como pago:
metaPixel.trackPurchase(
  orderId,
  cart,
  total,
  customerData
)
```

**Quando dispara:** Quando status do PIX = 'paid' (confirmado)

**Dados enviados:**
- Todos os dados do InitiateCheckout +
- `event_id` - orderId (para deduplicação)
- `fbc` / `fbp` - Tracking IDs do Facebook
- Advanced Matching (email, phone, nome, cidade, etc.)

---

## 🎉 BENEFÍCIOS DA IMPLEMENTAÇÃO

### ✅ Para o Facebook Pixel:
- **Funil completo:** Trackeia desde início do checkout até compra
- **Otimização precisa:** Facebook sabe diferenciar "tentou comprar" vs "comprou"
- **Audiences melhores:** Pode criar públicos de cada etapa do funil
- **Retargeting avançado:** Recuperar PIX abandonados vs compradores

### ✅ Para você:
- ✅ Facebook otimiza campanhas para conversões REAIS (PIX pagos)
- ✅ Pode criar campanhas para recuperar PIX não pagos
- ✅ Métricas mais precisas (taxa de conversão real)
- ✅ Padrão recomendado por Facebook + ZuckPay

---

## 📊 DADOS ENVIADOS PARA O FACEBOOK

### InitiateCheckout (ao gerar PIX):
```javascript
{
  content_ids: [58, 77, 63],
  contents: [
    { id: 58, quantity: 2, item_price: 149.90 },
    { id: 77, quantity: 1, item_price: 89.90 }
  ],
  value: 389.70,
  currency: 'BRL',
  num_items: 3
}
```

### Purchase (PIX pago):
```javascript
{
  content_ids: [58, 77, 63],
  contents: [
    { id: 58, quantity: 2, item_price: 149.90 },
    { id: 77, quantity: 1, item_price: 89.90 }
  ],
  value: 389.70,
  currency: 'BRL',
  num_items: 3,
  fbc: 'fb.1.1234567890.AbCdEf...',
  fbp: 'fb.1.1234567890.1234567890'
}
// + Advanced Matching (email, phone, nome hasheados)
```

---

## 🔍 COMO VERIFICAR SE ESTÁ FUNCIONANDO

### 1. **Teste InitiateCheckout** (gerar PIX)
1. Acesse: https://business.facebook.com/events_manager/
2. Pixel ID: `2385886815248822`
3. Vá em "Test Events"
4. Faça um checkout até gerar o PIX
5. Veja o evento **InitiateCheckout** aparecer ✅

### 2. **Teste Purchase** (pagar PIX)
1. Mesma tela de Test Events
2. Pague o PIX gerado (ou use botão de teste se disponível)
3. Aguarde alguns segundos
4. Veja o evento **Purchase** aparecer ✅

### 3. **Meta Pixel Helper** (Chrome Extension)
- Instale: https://chrome.google.com/webstore/detail/meta-pixel-helper/
- Veja os eventos dispararem em tempo real

---

## 🎯 VANTAGENS DESSA ESTRATÉGIA

### vs Disparar Purchase imediatamente:
- ❌ Purchase imediato = inclui PIX não pagos (métrica inflada)
- ✅ InitiateCheckout + Purchase = métricas precisas

### vs Não trackear nada:
- ❌ Sem eventos = Facebook não otimiza
- ✅ Com eventos = Campanhas funcionam melhor

### Melhor dos dois mundos:
- ✅ Trackeia TODOS os checkouts (InitiateCheckout)
- ✅ Trackeia APENAS conversões reais (Purchase)
- ✅ Facebook consegue otimizar corretamente
- ✅ Você consegue recuperar PIX abandonados

---

## 📊 MÉTRICAS QUE VOCÊ TERÁ AGORA

```
InitiateCheckout: 100 eventos
    ↓
PIX gerados: 100
    ↓
Purchase: 35 eventos (35% pagaram)
    ↓
Taxa de conversão: 35%
```

Com isso você pode:
- Criar campanha para os 65 que não pagaram (retargeting)
- Otimizar campanhas para quem converte de verdade
- Entender onde está perdendo clientes

---

## 📁 ARQUIVOS MODIFICADOS

1. **src/pages/Checkout.jsx**
   - Import: `trackInitiateCheckout`
   - Dispara `InitiateCheckout` após gerar PIX
   - Remove flag `purchaseEventSent`

2. **src/pages/OrderSuccess.jsx**
   - Dispara `Purchase` quando PIX é pago (status = 'paid')
   - Remove verificação de flag
   - Mantém chamada para Utmify também

3. **src/services/metaPixel.js** (já existia)
   - Função `trackInitiateCheckout()` ✅
   - Função `trackPurchase()` ✅

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [x] InitiateCheckout dispara ao gerar PIX
- [x] Purchase dispara quando PIX é pago
- [x] Event ID único para deduplicação
- [x] Advanced Matching configurado
- [x] FBC e FBP incluídos
- [x] Valores corretos (incluindo frete)
- [x] IDs dos produtos incluídos
- [x] Padrão recomendado Facebook + ZuckPay

---

## 🎯 RESULTADO ESPERADO

### ANTES:
- ❌ 0 eventos de conversão
- ❌ Facebook não otimiza campanhas
- ❌ Impossível recuperar PIX abandonados

### AGORA:
- ✅ InitiateCheckout: ~100% dos checkouts
- ✅ Purchase: ~35% dos checkouts (PIX pagos)
- ✅ Facebook otimiza para conversões reais
- ✅ Pode criar retargeting de PIX não pagos

---

## 🚀 PRÓXIMOS PASSOS (OPCIONAL)

### 1. **Conversions API (CAPI)** - Recomendado
- Envia eventos do servidor (não bloqueável)
- Mais confiável que pixel browser
- Mesmos event_id para deduplicação

### 2. **Webhook ZuckPay** - Para garantir Purchase
- ZuckPay chama seu webhook quando PIX é pago
- Você pode disparar Purchase server-side
- Backup caso cliente feche navegador

### 3. **Eventos adicionais**
- `AddPaymentInfo` - Ao preencher dados (opcional)
- `ViewContent` - Já implementado ✅
- `AddToCart` - Já implementado ✅

---

## 📞 COMO VERIFICAR SE ESTÁ TUDO OK

1. **Events Manager do Facebook**
   - Deve ver InitiateCheckout após checkouts
   - Deve ver Purchase após PIX pagos
   - Taxa de conversão deve ser realista (30-50%)

2. **Relatórios de Campanhas**
   - Otimizar para "Purchase" nas campanhas
   - Facebook vai direcionar tráfego para quem converte

3. **Audiences**
   - Criar: "Fez InitiateCheckout mas NÃO fez Purchase" (retargeting)
   - Criar: "Fez Purchase" (lookalike audiences)

---

**Data da correção:** 10/06/2026  
**Status:** ✅ Implementado e testado  
**Padrão:** Facebook + ZuckPay (recomendado oficialmente)
