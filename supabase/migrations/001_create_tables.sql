-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  tax_id TEXT NOT NULL, -- CPF/CNPJ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para busca rápida por CPF
CREATE INDEX IF NOT EXISTS idx_customers_tax_id ON customers(tax_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  
  -- Dados do pedido
  order_number TEXT UNIQUE NOT NULL, -- Ex: ORD-20260115-001
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, paid, shipped, delivered, cancelled, refunded
  
  -- Valores
  subtotal INTEGER NOT NULL, -- em centavos
  shipping_fee INTEGER NOT NULL DEFAULT 0, -- em centavos
  discount INTEGER DEFAULT 0, -- em centavos
  total INTEGER NOT NULL, -- em centavos
  currency TEXT NOT NULL DEFAULT 'BRL',
  
  -- Pagamento
  payment_method TEXT, -- PIX, CREDIT_CARD, BOLETO
  payment_status TEXT DEFAULT 'pending', -- pending, paid, refused, refunded
  avenpay_payment_id TEXT UNIQUE, -- ID do pagamento na Avenpay
  
  -- Rastreio
  tracking_code TEXT, -- Código de rastreio do DiaLOG
  tracking_url TEXT, -- URL de rastreio
  
  -- Endereço de entrega
  shipping_address JSONB, -- {street, number, complement, neighborhood, city, state, zipcode, country}
  
  -- Metadados
  customer_ip TEXT,
  user_agent TEXT,
  utm_data JSONB, -- {utmSource, utmMedium, utmCampaign, etc}
  notes TEXT,
  
  -- Timestamps
  paid_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para busca rápida
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_avenpay_payment_id ON orders(avenpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_code ON orders(tracking_code);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  
  -- Dados do produto
  product_id INTEGER NOT NULL, -- ID do produto no sistema
  product_name TEXT NOT NULL,
  product_image TEXT,
  
  -- Valores
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL, -- em centavos
  total_price INTEGER NOT NULL, -- quantity * unit_price (em centavos)
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Tabela de Logs do Webhook Avenpay
CREATE TABLE IF NOT EXISTS avenpay_webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  
  -- Dados do webhook
  payment_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- payment.created, payment.paid, payment.refused, payment.refunded
  status_code INTEGER,
  request_body JSONB,
  response_body JSONB,
  error_message TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_avenpay_logs_payment_id ON avenpay_webhook_logs(payment_id);
CREATE INDEX IF NOT EXISTS idx_avenpay_logs_order_id ON avenpay_webhook_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_avenpay_logs_created_at ON avenpay_webhook_logs(created_at DESC);

-- Tabela de Logs do Webhook DiaLOG
CREATE TABLE IF NOT EXISTS dialog_webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  
  -- Dados do envio
  order_number TEXT NOT NULL,
  status_code INTEGER,
  request_body JSONB,
  response_body JSONB,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dialog_logs_order_id ON dialog_webhook_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_dialog_logs_order_number ON dialog_webhook_logs(order_number);
CREATE INDEX IF NOT EXISTS idx_dialog_logs_created_at ON dialog_webhook_logs(created_at DESC);

-- Tabela de Configurações da Integração
CREATE TABLE IF NOT EXISTS integration_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir configurações iniciais
INSERT INTO integration_settings (key, value, description) VALUES
  ('dialog_webhook_url', '', 'URL do webhook do DiaLOG para rastreio'),
  ('avenpay_api_key', '', 'Chave da API Avenpay para pagamentos'),
  ('avenpay_tokenization_key', '', 'Chave de tokenização Avenpay para cartão'),
  ('store_email', 'contato@oboticario.com', 'Email da loja'),
  ('store_phone', '+5511999999999', 'Telefone da loja')
ON CONFLICT (key) DO NOTHING;

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integration_settings_updated_at BEFORE UPDATE ON integration_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS) - Segurança
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE avenpay_webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dialog_webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: permitir acesso total com service_role
CREATE POLICY "Allow service role full access" ON customers FOR ALL USING (true);
CREATE POLICY "Allow service role full access" ON orders FOR ALL USING (true);
CREATE POLICY "Allow service role full access" ON order_items FOR ALL USING (true);
CREATE POLICY "Allow service role full access" ON avenpay_webhook_logs FOR ALL USING (true);
CREATE POLICY "Allow service role full access" ON dialog_webhook_logs FOR ALL USING (true);
CREATE POLICY "Allow service role full access" ON integration_settings FOR ALL USING (true);
