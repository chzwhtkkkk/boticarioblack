# 🚀 Quick Start - Testar E-commerce

## ⚡ Setup Rápido (2 minutos)

### 1. Adicione as 2 chaves no `.env.local`:

```env
AVENPAY_API_KEY=sua_chave_secreta
NEXT_PUBLIC_AVENPAY_TOKENIZATION_KEY=sua_chave_publica
```

**✅ DiaLOG já configurado:** A URL do webhook já está no `.env.local`

### 2. Configure o CartProvider em `src/pages/_app.jsx`:

```jsx
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

### 3. Configure webhook na Avenpay:

```
https://seu-dominio.com/api/webhooks/avenpay
```

**Local:** Use ngrok → `ngrok http 3000`

### 4. Rode o projeto:

```bash
npm run dev
```

---

## 🧪 Teste em 2 Minutos

### Teste PIX (mais rápido):

1. Adicione produto ao carrinho
2. Vá para `/checkout`
3. Preencha:
   - Nome: `Teste Silva`
   - Email: `teste@gmail.com`
   - Telefone: `11999999999`
   - CPF: `12345678900`
   - CEP: `01310100` (Av. Paulista - auto-completa)
   - Número: `123`
4. Escolha **PIX**
5. Clique **Finalizar Compra**
6. Você verá o QR Code PIX
7. Pague usando app do banco
8. Webhook confirma → DiaLOG recebe pedido automaticamente

### Teste Cartão (tokenização segura):

Igual ao PIX, mas:
- Escolha **Cartão de Crédito**
- Preencha:
  - Número: `5555 5555 5555 4444`
  - Nome: `TESTE SILVA`
  - Validade: `12/2029`
  - CVV: `123`
  - Parcelas: `1x`
- **Script Avenpay tokeniza automaticamente** antes de enviar
- Pedido aprovado na hora → DiaLOG recebe imediatamente

---

## 🔍 Verificar se Funcionou

### No Supabase (SQL Editor):

```sql
-- Ver último pedido
SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;

-- Ver se webhook chegou
SELECT * FROM avenpay_webhook_logs ORDER BY created_at DESC LIMIT 1;

-- Ver se DiaLOG recebeu
SELECT * FROM dialog_webhook_logs ORDER BY created_at DESC LIMIT 1;
```

### No Terminal Next.js:

Procure por:
```
✅ Order created: ORD-xxx
✅ Avenpay payment created: pay_xxx
✅ Webhook received: payment.paid
✅ DiaLOG notified: 200
```

---

## 🎯 Fluxo Automático Completo

```
Cliente compra
    ↓
Avenpay processa pagamento
    ↓
Webhook confirma pagamento (PAID)
    ↓
Sistema envia dados para DiaLOG
    ↓
DiaLOG cria código de rastreio
    ↓
DiaLOG envia email para cliente
    ↓
Cliente acessa /rastreio e vê status
```

**Tudo automático!** Você não precisa fazer nada manual.

---

## 🔐 Segurança do Cartão

### ❌ Antes (inseguro):
```
Cliente → Dados do cartão → Seu servidor → Avenpay
```

### ✅ Agora (PCI compliant):
```
Cliente → Script Avenpay tokeniza → TOKEN → Seu servidor → Avenpay
```

**Seus servidores nunca veem dados sensíveis do cartão!**

---

## 📱 URLs do Sistema

- `/` - Home (produtos)
- `/checkout` - Finalizar compra
- `/pedido/[orderNumber]` - Confirmação (QR Code PIX, boleto, status cartão)
- `/rastreio` - Rastrear pedido com CPF
- `/api/orders/create` - API criar pedido (POST)
- `/api/webhooks/avenpay` - Webhook Avenpay (POST)

---

## 🚨 Erros Comuns

### "Tokenizer não definido"
- ✅ Adicione `NEXT_PUBLIC_AVENPAY_TOKENIZATION_KEY` no .env.local
- ✅ Reinicie o Next.js (`npm run dev`)

### "Webhook não chega"
- ✅ Configure URL no painel Avenpay
- ✅ Use ngrok se estiver local
- ✅ Verifique firewall/antivirus

### "DiaLOG não recebeu"
- ✅ Verifique `DIALOG_WEBHOOK_URL` no .env.local
- ✅ Confirme que pedido está com status "paid"
- ✅ Veja logs: `SELECT * FROM dialog_webhook_logs`

---

## 📖 Documentação Completa

- **TODO-SETUP.md** - Checklist completo
- **FINAL-SETUP-GUIDE.md** - Guia detalhado com troubleshooting
- **SETUP-DATABASE.md** - Como criar as tabelas

---

**Pronto! Seu e-commerce está funcionando 🎉**

Se precisar de mais funcionalidades:
- 3D Secure (autenticação extra para cartões)
- Frete dinâmico (integração Correios)
- Painel admin
- Sistema de cupons
- Controle de estoque

Consulte `FINAL-SETUP-GUIDE.md` → "Próximos Passos Opcionais"
