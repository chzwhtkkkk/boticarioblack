-- Criar tabela para logs do webhook DiaLOG
CREATE TABLE IF NOT EXISTS dialog_webhook_logs (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  response_body TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para buscar logs por pedido
CREATE INDEX IF NOT EXISTS idx_dialog_logs_order_id ON dialog_webhook_logs(order_id);

-- Índice para buscar logs por data
CREATE INDEX IF NOT EXISTS idx_dialog_logs_sent_at ON dialog_webhook_logs(sent_at DESC);
