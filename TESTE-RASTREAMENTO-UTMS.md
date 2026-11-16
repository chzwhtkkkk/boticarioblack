# 🧪 GUIA DE TESTE: Rastreamento de UTMs

## ✅ Correção Aplicada

O problema de rastreamento de UTMs foi **CORRIGIDO**. Agora as UTMs são enviadas corretamente para a ZuckPay e aparecem no painel.

---

## 🚀 Como Testar Agora

### 1️⃣ Acesse o site com este link:
```
https://revendas-do-boti.vercel.app/?utm_source=facebook&utm_medium=cpc&utm_campaign=kits-dia-maes&utm_content=banner-70off
```

### 2️⃣ Faça uma compra de teste:
- Adicione qualquer produto ao carrinho
- Vá para o checkout
- Preencha todos os dados (pode usar dados de teste)
- Gere o PIX
- **PAGUE O PIX** (importante: precisa pagar para o webhook ser chamado)

### 3️⃣ Verifique no painel da ZuckPay:
1. Acesse: https://zuckpay.com.br/conta/
2. Faça login
3. Vá em **"Transações"**
4. Encontre a transação que você acabou de fazer
5. Clique para ver os detalhes

### 4️⃣ Verifique se os campos UTM estão preenchidos:

**ANTES (estava assim):**
```
SRC: --
CAMPANHA: --
MÍDIA: --
CONTEÚDO: --
ORIGEM: --
TERMO: --
```

**AGORA (deve estar assim):**
```
SRC: facebook
CAMPANHA: kits-dia-maes
MÍDIA: cpc
CONTEÚDO: banner-70off
ORIGEM: (preenchido automaticamente)
TERMO: (vazio se não usar utm_term)
```

---

## 🎯 O Que Foi Corrigido

### Problema:
As UTMs estavam sendo capturadas, mas **não eram enviadas para a ZuckPay** nos campos corretos da API.

### Solução:
Adicionados os campos UTM oficiais no payload enviado para a ZuckPay:
- `utm_source` → aparece como **SRC**
- `utm_campaign` → aparece como **CAMPANHA**
- `utm_medium` → aparece como **MÍDIA**
- `utm_content` → aparece como **CONTEÚDO**
- `utm_term` → aparece como **TERMO**

---

## 📊 Rastreamento na Utmify

Depois que o PIX for pago, o webhook automaticamente:
1. ✅ Dispara evento `Purchase` para a Utmify
2. ✅ Inclui as UTMs no evento
3. ✅ Você pode ver a conversão no painel da Utmify

**Para verificar na Utmify:**
1. Acesse: https://app.utmify.com.br/
2. Vá em **"Eventos"** ou **"Conversões"**
3. Procure pelo evento `Purchase` com o valor da sua compra
4. Verifique se as UTMs estão associadas

---

## 🔍 Logs para Debug

Se quiser ver os logs detalhados, abra o **Console do Navegador** (F12) e procure por:

```
[UTM Manager] UTMs capturadas e salvas: {...}
[Checkout] UTMs que serão enviadas com o pedido: {...}
```

No servidor (Vercel), você verá:
```
[API create-pix] UTMs recebidas: {...}
🎯 UTM Source: facebook
🎯 UTM Campaign: kits-dia-maes
🎯 UTM Medium: cpc
🎯 UTM Content: banner-70off
```

---

## 💡 Dicas Importantes

### ✅ Pode usar o mesmo link em múltiplos anúncios?
**SIM!** Você pode usar o mesmo link em vários anúncios da **mesma campanha**.

### ✅ E se eu duplicar/escalar a campanha?
Se for a **mesma campanha**, pode continuar usando o mesmo link.

### ✅ E se eu criar uma campanha nova?
Aí você deve criar um link novo com `utm_campaign` diferente. Exemplo:
```
utm_campaign=kits-dia-maes-v2
utm_campaign=perfumes-masculinos
utm_campaign=natal-2026
```

### ✅ Preciso criar um link diferente para cada anúncio?
**NÃO!** Você pode usar o mesmo link em todos os anúncios da mesma campanha. O Meta já rastreia qual anúncio específico gerou a conversão internamente.

---

## 🎯 Link Recomendado para Anúncios

Use este link nos seus anúncios do Meta:

```
https://revendas-do-boti.vercel.app/?utm_source=facebook&utm_medium=cpc&utm_campaign=kits-dia-maes&utm_content=banner-70off
```

**Significado de cada parâmetro:**
- `utm_source=facebook` → Origem: Facebook/Meta
- `utm_medium=cpc` → Meio: Custo por Clique (anúncio pago)
- `utm_campaign=kits-dia-maes` → Campanha: Kits Dia das Mães
- `utm_content=banner-70off` → Conteúdo: Banner com 70% OFF

---

## ✅ Checklist de Teste

- [ ] Acessei o site com o link que contém UTMs
- [ ] Adicionei produto ao carrinho
- [ ] Fui para o checkout
- [ ] Preenchi todos os dados
- [ ] Gerei o PIX
- [ ] **PAGUEI O PIX** (importante!)
- [ ] Verifiquei no painel da ZuckPay
- [ ] Os campos UTM estão preenchidos (não estão mais como `--`)
- [ ] Verifiquei na Utmify (opcional)

---

## 🚨 Se Ainda Não Funcionar

Se depois de fazer o teste os campos UTM ainda aparecerem como `--`:

1. **Verifique se você acessou o site com o link completo** (com os parâmetros UTM)
2. **Verifique se você PAGOU o PIX** (o webhook só é chamado após o pagamento)
3. **Limpe o cache do navegador** e tente novamente
4. **Abra o Console (F12)** e veja se há erros
5. **Me avise** e eu vou investigar os logs do servidor

---

## 📞 Suporte

Se tiver qualquer dúvida ou problema, me chama que eu te ajudo! 🚀
