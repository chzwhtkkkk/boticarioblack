// Webhook Avenpay + Integração DiaLOG
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Webhook-Event, X-Webhook-Signature');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payment = req.body;
    const eventType = req.headers['x-webhook-event'] || 'payment.updated';

    console.log('═══════════════════════════════════════');
    console.log('🔔 WEBHOOK AVENPAY');
    console.log('Event:', eventType);
    console.log('Payment ID:', payment.id);
    console.log('Status:', payment.status);
    console.log('Amount:', payment.amount);
    console.log('Method:', payment.method);
    console.log('External Ref:', payment.externalRef);
    console.log('═══════════════════════════════════════');

    // Buscar pedido pelo externalRef (order_number)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, customer:customers(*)')
      .eq('order_number', payment.externalRef)
      .single();

    if (orderError || !order) {
      console.error('❌ Pedido não encontrado:', payment.externalRef);
      return res.status(200).json({ 
        success: false, 
        error: 'Order not found' 
      });
    }

    // Registrar log do webhook
    await supabase
      .from('avenpay_webhook_logs')
      .insert([{
        order_id: order.id,
        payment_id: payment.id,
        event_type: eventType,
        status_code: 200,
        request_body: req.body,
        response_body: { status: 'processing' }
      }]);

    // Atualizar pedido baseado no status
    const updateData = {
      avenpay_payment_id: payment.id
    };

    if (payment.status === 'PAID') {
      console.log('✅ PAGAMENTO APROVADO!');
      updateData.status = 'paid';
      updateData.payment_status = 'paid';
      updateData.paid_at = new Date().toISOString();

      // Atualizar pedido
      await supabase
        .from('orders')
        .update(updateData)
        .eq('id', order.id);

      // Enviar para DiaLOG
      await sendToDialog(order, payment);

    } else if (payment.status === 'REFUSED') {
      console.log('❌ PAGAMENTO RECUSADO');
      updateData.status = 'cancelled';
      updateData.payment_status = 'refused';

      await supabase
        .from('orders')
        .update(updateData)
        .eq('id', order.id);

    } else if (payment.status === 'REFUNDED') {
      console.log('💸 PAGAMENTO REEMBOLSADO');
      updateData.status = 'refunded';
      updateData.payment_status = 'refunded';

      await supabase
        .from('orders')
        .update(updateData)
        .eq('id', order.id);

    } else {
      // PENDING, PROCESSING, etc
      updateData.status = 'processing';

      await supabase
        .from('orders')
        .update(updateData)
        .eq('id', order.id);
    }

    return res.status(200).json({ 
      success: true,
      message: 'Webhook processado' 
    });

  } catch (error) {
    console.error('❌ Erro no webhook Avenpay:', error);
    
    // Registrar erro no log
    try {
      await supabase
        .from('avenpay_webhook_logs')
        .insert([{
          payment_id: req.body?.id || 'unknown',
          event_type: req.headers['x-webhook-event'] || 'unknown',
          status_code: 500,
          request_body: req.body,
          error_message: error.message
        }]);
    } catch (logError) {
      console.error('Erro ao registrar log:', logError);
    }

    return res.status(500).json({ 
      error: 'Erro ao processar webhook' 
    });
  }
}

// Função para enviar dados pro DiaLOG quando pagamento é confirmado
async function sendToDialog(order, payment) {
  const dialogWebhookUrl = process.env.DIALOG_WEBHOOK_URL;

  if (!dialogWebhookUrl) {
    console.error('❌ DIALOG_WEBHOOK_URL não configurada');
    return;
  }

  try {
    // Buscar itens do pedido
    const { data: items } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);

    // Montar payload para o DiaLOG
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
      products: items.map(item => ({
        name: item.product_name,
        price: item.unit_price / 100, // converter de centavos para reais
        quantity: item.quantity,
        weight: 0.5 // peso padrão em kg
      })),
      total: order.total / 100 // converter de centavos para reais
    };

    console.log('📦 Enviando para DiaLOG:', order.order_number);

    // Enviar para DiaLOG
    const dialogResponse = await fetch(dialogWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dialogPayload)
    });

    const dialogData = await dialogResponse.json();

    // Registrar log
    await supabase
      .from('dialog_webhook_logs')
      .insert([{
        order_id: order.id,
        order_number: order.order_number,
        status_code: dialogResponse.status,
        request_body: dialogPayload,
        response_body: dialogData,
        error_message: dialogResponse.ok ? null : JSON.stringify(dialogData)
      }]);

    if (dialogResponse.ok) {
      console.log('✅ Pedido enviado pro DiaLOG com sucesso:', order.order_number);
      console.log('📧 Cliente receberá email com tracking');
    } else {
      console.error('❌ Erro ao enviar pro DiaLOG:', dialogData);
    }

  } catch (error) {
    console.error('❌ Erro ao enviar pro DiaLOG:', error);

    // Registrar erro no log
    await supabase
      .from('dialog_webhook_logs')
      .insert([{
        order_id: order.id,
        order_number: order.order_number,
        status_code: 0,
        error_message: error.message,
        retry_count: 0
      }]);
  }
}
