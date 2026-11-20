# 🔐 Configurar Permissões do Supabase (RLS)

## ❌ Problema:
A API está retornando erro 404/Unauthorized porque as tabelas estão protegidas com RLS (Row Level Security).

## ✅ Solução:
Execute o SQL abaixo no Supabase para permitir que clientes vejam seus pedidos.

---

## 📝 Passo a Passo:

### 1. Acesse o SQL Editor do Supabase:
- Vá em: https://supabase.com/dashboard/project/onscojkssuytbqzqgafu
- Clique em **SQL Editor** no menu lateral

### 2. Cole e execute este SQL:

```sql
-- Habilitar RLS nas tabelas
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Permitir leitura de clientes
DROP POLICY IF EXISTS "Clientes podem ver seus dados" ON customers;
CREATE POLICY "Clientes podem ver seus dados"
ON customers
FOR SELECT
USING (true);

-- Permitir leitura de pedidos
DROP POLICY IF EXISTS "Clientes podem ver pedidos" ON orders;
CREATE POLICY "Clientes podem ver pedidos"
ON orders
FOR SELECT
USING (true);

-- Permitir leitura de itens dos pedidos
DROP POLICY IF EXISTS "Clientes podem ver itens" ON order_items;
CREATE POLICY "Clientes podem ver itens"
ON order_items
FOR SELECT
USING (true);
```

### 3. Clique em **RUN** (ou pressione Ctrl+Enter)

### 4. Você deve ver:
```
Success. No rows returned
```

---

## 🔍 Verificar se funcionou:

Depois de executar o SQL, execute esta query para verificar:

```sql
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('customers', 'orders', 'order_items');
```

Deve retornar 3 linhas mostrando as políticas criadas.

---

## ⚠️ IMPORTANTE:

Esta configuração permite que **qualquer pessoa leia todos os pedidos**. 

Isso é OK por enquanto para testar, mas depois vamos melhorar para que cada cliente só veja seus próprios pedidos.

Para melhorar a segurança depois, você pode usar autenticação (login/senha) e políticas mais restritivas.

---

## 🧪 Testar:

Depois de executar o SQL:
1. Acesse: https://oboticariovendas.vercel.app/area-cliente
2. Digite um CPF de teste
3. Clique em "Buscar"
4. Deve funcionar! 🎉

---

**Me avise quando executar o SQL!** 🚀
