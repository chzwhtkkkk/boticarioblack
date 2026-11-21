-- Atualizar tabela dialog_webhook_logs com campos corretos
-- Rodar no SQL Editor do Supabase

-- Dropar tabela antiga se existir
DROP TABLE IF EXISTS dialog_webhook_logs;

-- Criar nova tabela com campos corretos
CREATE TABLE dialog_webhook_logs (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id),
  status_code INTEGER NOT NULL,
  response_body TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Criar índice para buscar logs por pedido
CREATE INDEX idx_dialog_logs_order_id ON dialog_webhook_logs(order_id);

-- Comentários
COMMENT ON TABLE dialog_webhook_logs IS 'Logs de envio de webhooks para o DiaLOG Rastreios';
COMMENT ON COLUMN dialog_webhook_logs.order_id IS 'ID do pedido no sistema';
COMMENT ON COLUMN dialog_webhook_logs.status_code IS 'HTTP status code da resposta do DiaLOG (0 = erro de rede)';
COMMENT ON COLUMN dialog_webhook_logs.response_body IS 'Corpo da resposta do DiaLOG ou mensagem de erro';
COMMENT ON COLUMN dialog_webhook_logs.sent_at IS 'Timestamp do envio do webhook';
