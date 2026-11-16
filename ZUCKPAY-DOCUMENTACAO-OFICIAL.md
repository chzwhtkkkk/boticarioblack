# 📚 ZuckPay - Documentação Oficial

## 🎯 DESCOBERTA IMPORTANTE

A ZuckPay **NÃO armazena endereço** em campos separados no painel deles!

Segundo a documentação oficial, os únicos campos aceitos são:
- ✅ `nome`
- ✅ `cpf`
- ✅ `email`
- ✅ `telefone`
- ✅ `valor`
- ✅ `urlnoty`
- ✅ `descricao` (opcional)
- ✅ `external_id_client` (opcional)
- ✅ `splits` (opcional - para split de pagamento)

## ❌ O QUE A ZUCKPAY NÃO MOSTRA

A ZuckPay **não tem campos** para:
- ❌ Endereço
- ❌ Número
- ❌ Complemento
- ❌ Bairro
- ❌ Cidade
- ❌ Estado
- ❌ CEP

**Esses dados ficam apenas no campo `descricao`!**

## ✅ COMO FUNCIONA

### No Painel da ZuckPay você vê:
```
Detalhes do cliente
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nome: João Cliente
CPF/CNPJ: 123.456.789-01
Email: joao@exemplo.com
Telefone: (11) 99999-8888
```

### O endereço fica na descrição:
```
Descrição do Pedido
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pedido #ORD-1234567890 - Endereço: Rua Jardel Filho, 11 - 
Conquista, Cacoal/RO - CEP: 76964164
```

## 📋 PAYLOAD CORRETO

```javascript
{
  "nome": "João Cliente",
  "cpf": "12345678901",
  "email": "joao@exemplo.com",
  "telefone": "11999998888",
  "valor": 100.00,
  "urlnoty": "https://seusite.com/webhook",
  "descricao": "Pedido #123 - Endereço: Rua X, 10 - Bairro Y, Cidade/UF",
  "external_id_client": "ORD-123"
}
```

## 🔧 O QUE FOI AJUSTADO

### ANTES (Errado):
```javascript
{
  nome: "...",
  cpf: "...",
  email: "...",
  telefone: "...",
  celular: "...",        // ❌ Campo não existe
  endereco: "...",       // ❌ Campo não existe
  numero: "...",         // ❌ Campo não existe
  complemento: "...",    // ❌ Campo não existe
  bairro: "...",         // ❌ Campo não existe
  cidade: "...",         // ❌ Campo não existe
  estado: "...",         // ❌ Campo não existe
  cep: "...",            // ❌ Campo não existe
  utm_source: "...",     // ❌ Campo não existe
  utm_campaign: "...",   // ❌ Campo não existe
  client_id: "...",      // ❌ Vai no header
  client_secret: "..."   // ❌ Vai no header
}
```

### DEPOIS (Correto):
```javascript
{
  nome: "João Cliente",
  cpf: "12345678901",
  email: "joao@exemplo.com",
  telefone: "11999998888",
  valor: 100.00,
  urlnoty: "https://seusite.com/webhook",
  descricao: "Pedido #123 - Endereço: Rua X, 10 - Bairro Y, Cidade/UF - CEP: 12345678",
  external_id_client: "ORD-123"
}
```

## 📱 SOBRE O TELEFONE

A ZuckPay aceita o campo `telefone` (não `celular`).

**Formato:** Apenas números, sem máscara
- ✅ Correto: `"11999998888"`
- ❌ Errado: `"(11) 99999-8888"`

Se ainda aparecer "Não informado", pode ser:
1. **Validação da ZuckPay** - Eles podem validar se é um número válido
2. **DDD inválido** - Verificar se o DDD existe
3. **Quantidade de dígitos** - Celular deve ter 11 dígitos (DDD + 9 + número)

## 🧪 TESTE

Faça uma nova compra com:
- **Telefone válido** com DDD real
- **11 dígitos** para celular (ex: 11999998888)
- **10 dígitos** para fixo (ex: 1133334444)

## 📊 ONDE FICAM OS DADOS

### No seu sistema (localStorage):
```javascript
{
  customer: {
    name: "João",
    email: "joao@email.com",
    phone: "11999998888",
    cpf: "12345678901",
    address: "Rua X",
    number: "10",
    neighborhood: "Bairro Y",
    city: "São Paulo",
    state: "SP",
    cep: "12345678"
  }
}
```

### Na ZuckPay (painel):
```
Nome: João
Email: joao@email.com
Telefone: (11) 99999-8888
CPF: 123.456.789-01

Descrição: Pedido #123 - Endereço: Rua X, 10 - Bairro Y, São Paulo/SP - CEP: 12345678
```

## ✅ CONCLUSÃO

A ZuckPay é um **gateway de pagamento**, não um **sistema de gestão de pedidos**.

Eles armazenam apenas:
- Dados do pagador (nome, CPF, email, telefone)
- Valor da transação
- Status do pagamento

**O endereço completo fica:**
1. No seu sistema (localStorage/banco de dados)
2. No campo `descricao` da ZuckPay (para referência)
3. No email que você envia para o cliente

**Isso é normal e esperado!** ✅

---

**Deploy enviado com payload correto!** 🚀
