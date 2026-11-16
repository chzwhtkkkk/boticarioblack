# 🧪 Como Testar a Integração PIX da ZuckPay

## 📋 Situação Atual

Você está recebendo erro 405 ao tentar gerar PIX. Criei ferramentas de teste para identificar exatamente onde está o problema.

## 🔧 O Que Foi Feito

1. ✅ **Melhorado o log de erro** na API principal (`api/create-pix.js`)
   - Agora mostra qual método foi recebido quando der erro 405
   - Ajuda a identificar se a requisição está chegando correta

2. ✅ **Criada API de teste** (`api/test-pix.js`)
   - Faz testes diretos com a ZuckPay
   - Verifica se as credenciais estão funcionando
   - Mostra logs detalhados da resposta

3. ✅ **Criada página de teste visual** (`test-pix.html`)
   - Interface gráfica para testar tudo
   - 3 níveis de teste diferentes
   - Mostra resultados em tempo real

## 🚀 Como Testar

### **PASSO 1: Limpar Cache do Vercel**

Antes de tudo, é CRUCIAL limpar o cache:

1. Acesse: https://vercel.com/charles15ams-projects/oboticario-revendas
2. Vá em **Settings** → **General**
3. Role até **Build & Development Settings**
4. Clique em **Clear Cache**
5. Faça um novo deploy (vai aparecer opção automaticamente)

**OU** force um redeploy:
- Vá em **Deployments**
- Clique nos 3 pontinhos do último deploy
- Clique em **Redeploy**

### **PASSO 2: Acessar a Página de Teste**

Depois do deploy/cache limpo (aguarde 1-2 minutos):

```
https://oboticario-revendas.vercel.app/test-pix.html
```

### **PASSO 3: Executar os Testes**

Na página de teste você verá 3 botões:

#### **Teste 1: API Básica**
- Verifica se a API serverless está funcionando
- Se falhar aqui = problema de deploy/roteamento

#### **Teste 2: Teste Direto ZuckPay**
- Faz uma compra de teste de R$ 10,00
- Se falhar aqui = problema com credenciais ou API da ZuckPay

#### **Teste 3: Simulação Real**
- Simula uma compra completa de R$ 100,00
- Com todos os dados (endereço, UTMs, etc)
- Se falhar aqui = problema na integração completa

### **PASSO 4: Testar no Checkout Real**

Se os testes acima passarem, teste o checkout real:

```
https://oboticario-revendas.vercel.app/
```

1. Adicione produtos no carrinho
2. Vá até o checkout
3. Preencha todos os dados
4. Clique em "Gerar PIX e Finalizar Pedido"

## 📊 Interpretando os Resultados

### ✅ Se TODOS os testes passarem:
- A integração está funcionando!
- O problema era cache
- Pode usar normalmente

### ❌ Se o Teste 1 falhar (API Básica):
- **Problema:** Vercel não está reconhecendo as rotas `/api`
- **Solução:** Verificar configuração do Vercel

### ❌ Se o Teste 2 falhar (ZuckPay):
- **Problema:** Credenciais erradas ou API da ZuckPay com problema
- **Solução:** Verificar credenciais no painel da ZuckPay

### ❌ Se o Teste 3 falhar (Simulação):
- **Problema:** Algum campo obrigatório está faltando
- **Solução:** Ajustar formato dos dados

## 🔍 Possíveis Causas do Erro 405

1. **Cache do Vercel/Browser** (mais provável)
   - Solução: Limpar cache + Ctrl+Shift+R

2. **Deploy incompleto**
   - Solução: Fazer redeploy manual

3. **Roteamento do Vercel**
   - Solução: Verificar `vercel.json` (já está correto)

4. **Método HTTP errado**
   - Solução: Já está correto (POST)

## 📝 Informações Técnicas

### Credenciais Atuais (Hardcoded para teste):
```
Client ID: chzwhtkkk_6298793160
Client Secret: fd27b2154beb5fc95a3a7492629b24e8f5283060b12ac5f80ecb99bcf5e6f98c
```

### Endpoint ZuckPay:
```
POST https://zuckpay.com.br/conta/v3/pix/qrcode
```

### Autenticação:
```
Basic Auth (conforme documentação)
Authorization: Basic base64(client_id:client_secret)
```

## 🎯 Próximos Passos

Depois de testar, me manda o resultado aqui:

**Se deu certo:**
- "Funcionou! Teste X passou"
- Aí eu crio a página de sucesso com QR Code

**Se deu erro:**
- Me manda o resultado completo que apareceu
- Principalmente qual teste falhou
- E a mensagem de erro exata

## ⚠️ IMPORTANTE

- **NÃO teste com valores reais ainda** - são testes!
- Os testes usam valores fictícios (R$ 10 e R$ 100)
- Quando funcionar, a ZuckPay VAI cobrar de verdade
- Por isso use SEMPRE dados de teste primeiro

## 💡 Dica Rápida

Se estiver com pressa:

1. Limpa cache do Vercel
2. Aguarda 2 minutos
3. Acessa: `https://oboticario-revendas.vercel.app/test-pix.html`
4. Clica no botão "Simular Compra Real" (Teste 3)
5. Me manda o resultado

---

**Deploy atual:** ✅ Feito e enviado
**Status:** Aguardando você testar
**Arquivos novos:**
- `api/test-pix.js` (API de teste)
- `test-pix.html` (Página visual de teste)
- `TESTE-PIX-ZUCKPAY.md` (Este arquivo)
