# 📦 Setup do Banco de Dados

## Passo 1: Rodar as Migrações SQL

1. Acesse o Supabase: https://supabase.com/dashboard
2. Selecione seu projeto: **oboticario-store**
3. No menu lateral, clique em **SQL Editor** (ícone de código)
4. Clique em **+ New Query**
5. Copie TODO o conteúdo do arquivo: `supabase/migrations/001_create_tables.sql`
6. Cole no editor SQL
7. Clique em **RUN** (ou pressione Ctrl+Enter)

✅ Se aparecer "Success. No rows returned", está perfeito!

## Passo 2: Verificar se as tabelas foram criadas

1. No menu lateral, clique em **Table Editor**
2. Você deve ver estas tabelas:
   - `customers`
   - `orders`
   - `order_items`
   - `avenpay_webhook_logs`
   - `dialog_webhook_logs`
   - `integration_settings`

## Passo 3: Instalar dependências do projeto

Abra o terminal na pasta do projeto e rode:

```bash
npm install @supabase/supabase-js
```

## Próximos passos

Depois de fazer isso, me avisa que eu continuo criando:
- ✅ Edge Functions (webhooks)
- ✅ Página de Checkout
- ✅ Integração com Avenpay
- ✅ Integração com DiaLOG
- ✅ Página de Rastreio
