-- PASSO 1: Verificar políticas existentes
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename IN ('customers', 'orders', 'order_items')
ORDER BY tablename, policyname;

-- Se não aparecer nenhuma política, ou aparecerem políticas antigas, execute os comandos abaixo:

-- PASSO 2: Remover TODAS as políticas antigas
DROP POLICY IF EXISTS "Clientes podem ver seus dados" ON customers;
DROP POLICY IF EXISTS "Clientes podem ver pedidos" ON orders;
DROP POLICY IF EXISTS "Clientes podem ver itens" ON order_items;
DROP POLICY IF EXISTS "Clientes podem ver seus próprios dados" ON customers;
DROP POLICY IF EXISTS "Clientes podem ver seus próprios pedidos" ON orders;
DROP POLICY IF EXISTS "Clientes podem ver itens dos seus pedidos" ON order_items;

-- PASSO 3: Desabilitar RLS temporariamente (para testar)
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

-- PASSO 4: Verificar se desabilitou
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('customers', 'orders', 'order_items');
-- Se rowsecurity = false, então funcionou!
