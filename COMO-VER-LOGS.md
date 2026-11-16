# 🔍 Como Ver os Logs do Checkout

## IMPORTANTE: Faça um novo teste AGORA
O código foi atualizado várias vezes. Você precisa fazer uma **nova compra de teste** para ver os logs atualizados.

---

## 📱 PASSO 1: Ver Logs do FRONTEND (Navegador)

### Como abrir o Console:
1. Abra seu site: https://oboticario-revendas.vercel.app/
2. Pressione **F12** no teclado (ou clique com botão direito → "Inspecionar")
3. Clique na aba **"Console"** (geralmente a segunda aba)

### O que você vai ver:
Quando preencher o formulário e clicar em "Confirmar Pedido", vai aparecer:

```
[Checkout] Dados que serão enviados para o gateway: {...}
[Checkout] Customer data: {
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "43999999999",
  "document": "12345678900",
  ...
}
```

### ✅ O que verificar:
- [ ] `email` está preenchido?
- [ ] `phone` está preenchido?
- [ ] `name` está preenchido?
- [ ] `document` está preenchido?

**Se todos estiverem preenchidos aqui, o problema NÃO é no frontend!**

---

## 🖥️ PASSO 2: Ver Logs do BACKEND (Vercel)

### Como acessar:
1. Acesse: https://vercel.com/
2. Faça login
3. Clique no seu projeto: **oboticario-revendas**
4. No menu lateral esquerdo, clique em **"Logs"** (ícone de lista)

### Alternativa (mais fácil):
1. Acesse: https://vercel.com/
2. Clique no projeto
3. Clique na aba **"Functions"** (no topo)
4. Clique em **"create-pix"**
5. Role para baixo até ver os logs

### O que você vai ver:
```
[API create-pix] Dados recebidos: {
  "orderId": "ORD-1234567890",
  "total": 89.90,
  "customer": {
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "43999999999",
    "document": "12345678900"
  }
}
```

### ✅ O que verificar:
- [ ] `customer.email` está preenchido?
- [ ] `customer.phone` está preenchido?
- [ ] `customer.name` está preenchido?
- [ ] `customer.document` está preenchido?

---

## 🎯 DIAGNÓSTICO

### Cenário 1: Todos os campos estão no FRONTEND mas faltam no BACKEND
**Problema:** Dados estão sendo perdidos na transmissão
**Solução:** Problema na API ou na serialização JSON

### Cenário 2: Campos já estão faltando no FRONTEND
**Problema:** Formulário não está capturando os dados
**Solução:** Problema no state do React

### Cenário 3: Todos os campos estão em ambos
**Problema:** Logs que você viu eram antigos (antes do último deploy)
**Solução:** Nenhuma! Está funcionando corretamente

---

## 📸 TIRE PRINTS

Para eu te ajudar melhor, tire prints de:
1. Console do navegador (F12 → Console) mostrando os logs do Checkout
2. Logs da Vercel mostrando o que chegou na API

Assim consigo ver exatamente onde os dados estão sendo perdidos!

---

## ⚡ TESTE RÁPIDO AGORA

1. Abra o site
2. Pressione F12
3. Vá para aba Console
4. Adicione um produto ao carrinho
5. Vá para o checkout
6. Preencha TODOS os campos (nome, email, telefone, CPF, endereço)
7. Clique em "Confirmar Pedido"
8. Veja os logs no Console
9. Me mande o que apareceu!
