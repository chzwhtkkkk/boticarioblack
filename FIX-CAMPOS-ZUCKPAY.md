# 🔧 Correção: Todos os Campos para ZuckPay

## ❌ PROBLEMA

A ZuckPay estava mostrando apenas:
- ✅ Nome
- ❌ Telefone (não informado)
- ❌ Email (não aparecia)
- ❌ Endereço (não aparecia)

## ✅ SOLUÇÃO

Adicionei **TODOS** os campos separados no payload que enviamos para a ZuckPay:

### Campos Adicionados:

```javascript
{
  // Dados pessoais
  nome: "chz",
  cpf: "44408217077",
  email: "chanbittkkk@gmail.com",
  telefone: "43998047132",
  celular: "43998047132",
  
  // Endereço completo (NOVO!)
  endereco: "Rua Jardel Filho",
  numero: "11",
  complemento: "Casa",
  bairro: "Conquista",
  cidade: "Cacoal",
  estado: "RO",
  cep: "76964164",
  
  // Outros campos
  valor: 27.9,
  descricao: "Pedido #ORD-123...",
  external_id_client: "ORD-123...",
  utm_source: "facebook",
  utm_campaign: "ABO-1-50-1",
  utm_medium: "cpc",
  utm_content: "banner-kits"
}
```

## 📋 CAMPOS ENVIADOS AGORA

### Dados Pessoais:
- ✅ `nome` - Nome completo
- ✅ `cpf` - CPF sem pontos/traços
- ✅ `email` - Email do cliente
- ✅ `telefone` - Telefone sem máscara
- ✅ `celular` - Mesmo que telefone (algumas APIs usam este campo)

### Endereço Completo:
- ✅ `endereco` - Rua/Avenida
- ✅ `numero` - Número da casa
- ✅ `complemento` - Complemento (apto, bloco, etc)
- ✅ `bairro` - Bairro
- ✅ `cidade` - Cidade
- ✅ `estado` - UF (2 letras)
- ✅ `cep` - CEP sem traço

### Pagamento:
- ✅ `valor` - Valor total
- ✅ `descricao` - Descrição do pedido com endereço
- ✅ `external_id_client` - ID do pedido

### Rastreamento:
- ✅ `utm_source` - Origem (facebook, google, etc)
- ✅ `utm_campaign` - Campanha (ABO-1-50-1)
- ✅ `utm_medium` - Meio (cpc, banner, etc)
- ✅ `utm_content` - Conteúdo
- ✅ `utm_term` - Termo

## 🧪 TESTE AGORA

1. **Aguarde 1-2 minutos** - Deploy está subindo
2. **Faça uma nova compra de teste**
3. **Verifique no painel da ZuckPay**

Agora deve aparecer:
- ✅ Nome
- ✅ Email
- ✅ Telefone/Celular
- ✅ CPF
- ✅ Endereço completo
- ✅ CEP

## 📊 LOGS

Os logs agora mostram todos os campos sendo enviados:

```
═══════════════════════════════════════════════════════
📤 [API CREATE-PIX] PAYLOAD PARA ZUCKPAY
═══════════════════════════════════════════════════════
👤 Nome: chz
📧 Email: chanbittkkk@gmail.com
📱 Telefone: 43998047132
📱 Celular: 43998047132
📄 CPF: 44408217077
💰 Valor: 27.9
📍 Endereço: Rua Jardel Filho
📍 Número: 11
📍 Complemento: Casa
📍 Bairro: Conquista
📍 Cidade: Cacoal
📍 Estado: RO
📍 CEP: 76964164
═══════════════════════════════════════════════════════
```

## 🎯 RESULTADO ESPERADO

No painel da ZuckPay deve aparecer:

```
Detalhes do cliente
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nome: chz
CPF/CNPJ: 444.082.170-77
Email: chanbittkkk@gmail.com
Telefone: (43) 99804-7132

Endereço
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Rua Jardel Filho, 11 - Casa
Bairro: Conquista
Cidade: Cacoal - RO
CEP: 76964-164
```

## ✅ STATUS

- ✅ Código atualizado
- ✅ Commit feito
- ✅ Push para GitHub
- ✅ Deploy automático na Vercel (1-2 minutos)

**Agora sim deve aparecer tudo!** 🚀
