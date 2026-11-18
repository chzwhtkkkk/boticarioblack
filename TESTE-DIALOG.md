# 🧪 Teste da Integração DiaLOG

## ✅ Configuração Atual

A URL do webhook DiaLOG já está configurada:
```
https://dnpgrcriaqpcybhzikvh.supabase.co/functions/v1/webhook-checkout/universal/c688fd32-379c-425e-a8ad-cc600ad69539?token=d04d15b2b59f4363a9064194ecb413973e46cc80249b43318d6c72f0f9ce93ae
```

**Sem autenticação HMAC** - o sistema apenas envia POST direto quando o pagamento é aprovado.

---

## 📤 Payload Enviado para DiaLOG

Quando um pagamento é confirmado (status `PAID`), o sistema envia automaticamente:

```json
{
  "order_id": "ORD-1234567890-ABC123",
  "status": "paid",
  "external_reference": "ORD-1234567890-ABC123",
  "customer": {
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "11999999999",
    "document": "12345678900"
  },
  "shipping_address": {
    "street": "Avenida Paulista",
    "number": "1000",
    "complement": "Apto 123",
    "neighborhood": "Bela Vista",
    "city": "São Paulo",
    "state": "SP",
    "zipcode": "01310100",
    "country": "BR"
  },
  "products": [
    {
      "name": "Malbec Desodorante Colônia",
      "price": 159.90,
      "quantity": 2,
      "weight": 0.5
    }
  ],
  "total": 319.80
}
```

**Observações:**
- ✅ Valores em **reais** (não centavos)
- ✅ Peso padrão: **0.5 kg** por produto
- ✅ Status sempre: **"paid"** (só envia após confirmação)

---

## 🔄 Fluxo Automático

```
1. Cliente paga PIX/Cartão/Boleto
    ↓
2. Avenpay confirma pagamento
    ↓
3. Avenpay envia webhook: POST /api/webhooks/avenpay
    ↓
4. Sistema atualiza pedido (payment_status: 'paid')
    ↓
5. Sistema chama sendToDialog()
    ↓
6. POST para URL DiaLOG com dados do pedido
    ↓
7. DiaLOG recebe e processa:
    - Cria código de rastreio
    - Envia email para cliente
    - Disponibiliza tracking
    ↓
8. Log registrado em dialog_webhook_logs
```

---

## 🧪 Como Testar

### Opção 1: Fazer um Pedido Real (PIX)

1. Adicione um produto ao carrinho
2. Vá para `/checkout`
3. Preencha os dados:
   - Nome: Seu nome
   - Email: Seu email (para receber o email da DiaLOG)
   - Telefone: Seu telefone
   - CPF: Seu CPF
   - CEP: `01310100` (Av. Paulista - auto-completa)
   - Número: `123`
4. Escolha **PIX**
5. Clique **Finalizar Compra**
6. Pague o PIX usando seu app bancário
7. Aguarde 5-10 segundos
8. Webhook Avenpay confirma → DiaLOG recebe → Você recebe email

### Opção 2: Simular Webhook Manualmente

Teste o endpoint diretamente via Postman/Insomnia:

**Endpoint:**
```
POST https://dnpgrcriaqpcybhzikvh.supabase.co/functions/v1/webhook-checkout/universal/c688fd32-379c-425e-a8ad-cc600ad69539?token=d04d15b2b59f4363a9064194ecb413973e46cc80249b43318d6c72f0f9ce93ae
```

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "order_id": "TEST-001",
  "status": "paid",
  "external_reference": "TEST-001",
  "customer": {
    "name": "Teste Silva",
    "email": "seu-email@example.com",
    "phone": "11999999999",
    "document": "12345678900"
  },
  "shipping_address": {
    "street": "Avenida Paulista",
    "number": "1000",
    "complement": "",
    "neighborhood": "Bela Vista",
    "city": "São Paulo",
    "state": "SP",
    "zipcode": "01310100",
    "country": "BR"
  },
  "products": [
    {
      "name": "Produto Teste",
      "price": 99.90,
      "quantity": 1,
      "weight": 0.5
    }
  ],
  "total": 99.90
}
```

**Resposta esperada:**
```json
{
  "success": true,
  "tracking_code": "BR123456789"
}
```

---

## 📊 Verificar Logs

### No Supabase (SQL Editor):

```sql
-- Ver últimos envios para DiaLOG
SELECT 
  created_at,
  order_number,
  status_code,
  request_body,
  response_body,
  error_message
FROM dialog_webhook_logs
ORDER BY created_at DESC
LIMIT 5;
```

### Ver pedidos pagos que foram enviados:
```sql
SELECT 
  o.order_number,
  o.paid_at,
  c.email as customer_email,
  dwl.status_code as dialog_status,
  dwl.response_body->>'tracking_code' as tracking_code
FROM orders o
JOIN customers c ON o.customer_id = c.id
LEFT JOIN dialog_webhook_logs dwl ON o.id = dwl.order_id
WHERE o.payment_status = 'paid'
ORDER BY o.paid_at DESC;
```

### Ver envios que falharam:
```sql
SELECT 
  created_at,
  order_number,
  status_code,
  error_message,
  retry_count
FROM dialog_webhook_logs
WHERE status_code != 200 OR status_code IS NULL
ORDER BY created_at DESC;
```

---

## 🚨 Troubleshooting

### ❌ DiaLOG não recebeu o pedido

**Verificar:**
1. Pedido está com status "paid"?
   ```sql
   SELECT payment_status FROM orders WHERE order_number = 'ORD-xxx';
   ```

2. Webhook foi enviado?
   ```sql
   SELECT * FROM dialog_webhook_logs WHERE order_number = 'ORD-xxx';
   ```

3. Qual foi o erro?
   ```sql
   SELECT status_code, error_message, response_body 
   FROM dialog_webhook_logs 
   WHERE order_number = 'ORD-xxx';
   ```

**Possíveis causas:**
- ✅ URL do webhook incorreta (verificar `.env.local`)
- ✅ Formato do payload incorreto
- ✅ DiaLOG API fora do ar
- ✅ Timeout na requisição

### ❌ Email não chegou

**Verificar:**
1. DiaLOG recebeu com sucesso?
   ```sql
   SELECT status_code, response_body 
   FROM dialog_webhook_logs 
   WHERE order_number = 'ORD-xxx';
   ```

2. Email do cliente está correto?
   ```sql
   SELECT c.email 
   FROM orders o
   JOIN customers c ON o.customer_id = c.id
   WHERE o.order_number = 'ORD-xxx';
   ```

3. Verificar spam/lixo eletrônico do cliente

### ❌ Status code 400/500

**Ação:**
1. Ver response_body no log:
   ```sql
   SELECT response_body FROM dialog_webhook_logs WHERE status_code >= 400 ORDER BY created_at DESC LIMIT 1;
   ```

2. Verificar formato do payload (deve ter todos os campos obrigatórios)

3. Verificar se valores estão corretos:
   - ✅ Preços em reais (não centavos)
   - ✅ CEP com 8 dígitos
   - ✅ Telefone com DDD
   - ✅ CPF com 11 dígitos

---

## 🔄 Reprocessar Pedido Manualmente

Se um pedido foi pago mas não foi enviado para DiaLOG, você pode reenviar manualmente:

### Opção 1: Via API Route (criar endpoint)

Crie `src/pages/api/retry-dialog.js`:

```javascript
import { supabaseAdmin } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderNumber } = req.body;

  try {
    // Buscar pedido
    const { data: order } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        customer:customers(*),
        items:order_items(*)
      `)
      .eq('order_number', orderNumber)
      .eq('payment_status', 'paid')
      .single();

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado ou não pago' });
    }

    // Montar payload
    const dialogPayload = {
      order_id: order.order_number,
      status: 'paid',
      external_reference: order.order_number,
      customer: {
        name: order.customer.name,
        email: order.customer.email,
        phone: order.customer.phone,
        document: order.customer.tax_id
      },
      shipping_address: {
        street: order.shipping_address.street,
        number: order.shipping_address.number,
        complement: order.shipping_address.complement || '',
        neighborhood: order.shipping_address.neighborhood,
        city: order.shipping_address.city,
        state: order.shipping_address.state,
        zipcode: order.shipping_address.zipCode,
        country: order.shipping_address.country || 'BR'
      },
      products: order.items.map(item => ({
        name: item.product_name,
        price: item.unit_price / 100,
        quantity: item.quantity,
        weight: 0.5
      })),
      total: order.total / 100
    };

    // Enviar para DiaLOG
    const response = await fetch(process.env.DIALOG_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dialogPayload)
    });

    const data = await response.json();

    // Registrar log
    await supabaseAdmin
      .from('dialog_webhook_logs')
      .insert([{
        order_id: order.id,
        order_number: order.order_number,
        status_code: response.status,
        request_body: dialogPayload,
        response_body: data,
        retry_count: 1
      }]);

    return res.status(200).json({ 
      success: true, 
      order: orderNumber,
      dialog_status: response.status,
      dialog_response: data
    });

  } catch (error) {
    console.error('Erro ao reenviar:', error);
    return res.status(500).json({ error: error.message });
  }
}
```

**Usar via curl:**
```bash
curl -X POST http://localhost:3000/api/retry-dialog \
  -H "Content-Type: application/json" \
  -d '{"orderNumber":"ORD-1234567890-ABC123"}'
```

### Opção 2: Via Postman/Insomnia

Busque os dados no Supabase e envie manualmente para a URL DiaLOG.

---

## ✅ Checklist de Sucesso

- [ ] URL do webhook configurada no `.env.local`
- [ ] Fazer pedido de teste com seu email
- [ ] Pagar o PIX
- [ ] Verificar log: `SELECT * FROM dialog_webhook_logs ORDER BY created_at DESC LIMIT 1;`
- [ ] Status code deve ser **200**
- [ ] Response body deve ter `tracking_code`
- [ ] Email deve chegar na caixa de entrada
- [ ] Testar rastreio em `/rastreio` com seu CPF

---

## 📧 Formato do Email que o Cliente Recebe

O email é enviado pela DiaLOG e deve conter:

- ✅ Confirmação do pedido
- ✅ Número do pedido (order_number)
- ✅ Código de rastreio (tracking_code)
- ✅ Link para rastrear: `https://seu-site.com/rastreio`
- ✅ Detalhes dos produtos
- ✅ Endereço de entrega
- ✅ Prazo estimado de entrega

**O conteúdo exato do email é configurado no painel da DiaLOG.**

---

**Pronto! Sistema integrado com DiaLOG e funcionando automaticamente 🚀**

Qualquer venda aprovada será enviada instantaneamente para a DiaLOG processar.
