import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const webhookEvent = req.headers['x-webhook-event'];
    const payment = req.body;

    console.log('Webhook Avenpay recebido:', {
      event: webhookEvent,
      paymentId: payment.id,
      status: payment.status,
      externalRef: payment.externalRef
    });

    // Buscar pedido pelo externalRef (order_number)
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('order_number', payment.externalRef)
      .single();

    if (orderError || !order) {
      console.error('Pedido não encontrado:', payment.externalRef);
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    // Registrar log do webhook
    await supabaseAdmin
      .from('avenpay_webhook_logs')
      .insert([{
        order_id: order.id,
        payment_id: payment.id,
        event_type: webhookEvent,
        status_code: 200,
        request_body: payment
      }]);

    // Atualizar status do pedido baseado no evento
    let updateData = {
      avenpay_payment_id: payment.id,
      payment_status: payment.status.toLowerCase()
    };

    // Se pagamento foi confirmado (PAID)
    if (payment.status === 'PAID') {
      updateData.status = 'paid';
      updateData.paid_at = new Date().toISOString();
      updateData.payment_status = 'paid';

      // Atualizar pedido
      await supabaseAdmin
        .from('orders')
        .update(updateData)
        .eq('id', order.id);

      // Enviar para DiaLOG criar código de rastreio
      await sendToDialog(order, payment);

    } else if (payment.status === 'REFUSED') {
      updateData.status = 'cancelled';
      updateData.payment_status = 'refused';

      await supabaseAdmin
        .from('orders')
        .update(updateData)
        .eq('id', order.id);

    } else if (payment.status === 'REFUNDED') {
      updateData.status = 'refunded';
      updateData.payment_status = 'refunded';

      await supabaseAdmin
        .from('orders')
        .update(updateData)
        .eq('id', order.id);

    } else {
      // PENDING, PROCESSING, etc
      updateData.status = 'processing';

      await supabaseAdmin
        .from('orders')
        .update(updateData)
        .eq('id', order.id);
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Erro no webhook Avenpay:', error);
    
    // Registrar erro no log
    try {
      await supabaseAdmin
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

    return res.status(500).json({ error: 'Erro ao processar webhook' });
  }
}

// Função para enviar dados pro DiaLOG quando pagamento é confirmado
async function sendToDialog(order, payment) {
  const dialogWebhookUrl = process.env.DIALOG_WEBHOOK_URL;

  if (!dialogWebhookUrl) {
    console.error('DIALOG_WEBHOOK_URL não configurada');
    return;
  }

  try {
    // Buscar cliente
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('id', order.customer_id)
      .single();

    // Buscar itens do pedido
    const { data: items } = await supabaseAdmin
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);

    // Montar payload para o DiaLOG
    const dialogPayload = {
      order_id: order.order_number,
      status: 'paid',
      external_reference: order.order_number,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        document: customer.tax_id
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
    await supabaseAdmin
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
      console.log('Pedido enviado pro DiaLOG com sucesso:', order.order_number);
    } else {
      console.error('Erro ao enviar pro DiaLOG:', dialogData);
    }

  } catch (error) {
    console.error('Erro ao enviar pro DiaLOG:', error);

    // Registrar erro no log
    await supabaseAdmin
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
