import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customer, items, shipping, payment } = req.body;

    // Validações básicas
    if (!customer || !items || !shipping || !payment) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    // Calcular valores
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = 1500; // R$ 15,00 em centavos
    const total = subtotal + shippingFee;

    // Gerar número do pedido único
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // 1. Criar/buscar cliente
    let customerId;
    const { data: existingCustomer } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('tax_id', customer.taxId)
      .single();

    if (existingCustomer) {
      customerId = existingCustomer.id;
      
      // Atualizar dados do cliente
      await supabaseAdmin
        .from('customers')
        .update({
          name: customer.name,
          email: customer.email,
          phone: customer.phone
        })
        .eq('id', customerId);
    } else {
      const { data: newCustomer, error } = await supabaseAdmin
        .from('customers')
        .insert([{
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          tax_id: customer.taxId
        }])
        .select()
        .single();

      if (error) throw error;
      customerId = newCustomer.id;
    }

    // 2. Criar pedido
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([{
        customer_id: customerId,
        order_number: orderNumber,
        status: 'pending',
        subtotal: subtotal,
        shipping_fee: shippingFee,
        total: total,
        currency: 'BRL',
        payment_method: payment.method,
        payment_status: 'pending',
        shipping_address: shipping,
        customer_ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        user_agent: req.headers['user-agent']
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // 3. Criar itens do pedido
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      product_image: item.image,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 4. Criar pagamento na Avenpay
    const avenpayApiKey = process.env.AVENPAY_API_KEY;
    
    if (!avenpayApiKey) {
      console.error('AVENPAY_API_KEY não configurada');
      return res.status(200).json({
        success: true,
        orderNumber: orderNumber,
        orderId: order.id,
        message: 'Pedido criado (pagamento manual)'
      });
    }

    const avenpayPayload = {
      amount: total,
      currency: 'BRL',
      method: payment.method,
      description: `Pedido ${orderNumber}`,
      externalRef: orderNumber,
      notificationUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com'}/api/webhooks/avenpay`,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress || '0.0.0.0',
      payer: {
        name: customer.name,
        taxId: customer.taxId,
        email: customer.email,
        phone: customer.phone
      },
      items: items.map(item => ({
        quantity: item.quantity,
        name: item.name,
        price: item.price,
        type: 'PHYSICAL'
      })),
      delivery: {
        fee: shippingFee,
        address: {
          country: shipping.country,
          state: shipping.state,
          city: shipping.city,
          district: shipping.neighborhood,
          street: shipping.street,
          number: shipping.number,
          zipCode: shipping.zipCode
        }
      }
    };

    // Se for cartão, adicionar token criptografado
    if (payment.method === 'CREDIT_CARD' && payment.cardToken) {
      avenpayPayload.card = {
        token: payment.cardToken, // Token criptografado do frontend
        installments: payment.installments || 1,
        chargeInterest: false
      };
    }

    // Chamar API da Avenpay
    const avenpayResponse = await fetch('https://api.avenpayments.com/v1/payment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${avenpayApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(avenpayPayload)
    });

    const avenpayData = await avenpayResponse.json();

    if (!avenpayResponse.ok) {
      console.error('Erro Avenpay:', avenpayData);
      throw new Error(avenpayData.message || 'Erro ao criar pagamento');
    }

    // 5. Atualizar pedido com ID do pagamento
    await supabaseAdmin
      .from('orders')
      .update({
        avenpay_payment_id: avenpayData.id,
        payment_status: avenpayData.status === 'PAID' ? 'paid' : 'pending'
      })
      .eq('id', order.id);

    // 6. Registrar log
    await supabaseAdmin
      .from('avenpay_webhook_logs')
      .insert([{
        order_id: order.id,
        payment_id: avenpayData.id,
        event_type: 'payment.created',
        status_code: avenpayResponse.status,
        request_body: avenpayPayload,
        response_body: avenpayData
      }]);

    // 7. Retornar resposta
    return res.status(200).json({
      success: true,
      orderNumber: orderNumber,
      orderId: order.id,
      paymentId: avenpayData.id,
      paymentData: avenpayData.data, // QR Code PIX, link boleto, etc
      paymentStatus: avenpayData.status
    });

  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return res.status(500).json({
      error: 'Erro ao processar pedido',
      message: error.message
    });
  }
}
