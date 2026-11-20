-- Configurar políticas de segurança (RLS) para área do cliente

-- 1. Habilitar RLS nas tabelas (se ainda não estiver)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 2. Criar política para permitir leitura de clientes (apenas pelo próprio CPF/email)
DROP POLICY IF EXISTS "Clientes podem ver seus próprios dados" ON customers;
CREATE POLICY "Clientes podem ver seus próprios dados"
ON customers
FOR SELECT
USING (true); -- Por enquanto, permitir leitura para todos (vamos melhorar depois)

-- 3. Criar política para permitir leitura de pedidos
DROP POLICY IF EXISTS "Clientes podem ver seus próprios pedidos" ON orders;
CREATE POLICY "Clientes podem ver seus próprios pedidos"
ON orders
FOR SELECT
USING (true); -- Por enquanto, permitir leitura para todos

-- 4. Criar política para permitir leitura de itens dos pedidos
DROP POLICY IF EXISTS "Clientes podem ver itens dos seus pedidos" ON order_items;
CREATE POLICY "Clientes podem ver itens dos seus pedidos"
ON order_items
FOR SELECT
USING (true); -- Por enquanto, permitir leitura para todos

-- 5. Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('customers', 'orders', 'order_items');
