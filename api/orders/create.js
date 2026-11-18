// API Vercel - Criar Pedido + Chamar Avenpay
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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customer, items, shipping, payment } = req.body;

    console.log('📦 Dados recebidos:', JSON.stringify(req.body, null, 2));

    // Validações básicas
    if (!customer) {
      console.error('❌ Customer faltando');
      return res.status(400).json({ error: 'Dados incompletos: customer' });
    }
    
    if (!items) {
      console.error('❌ Items faltando');
      return res.status(400).json({ error: 'Dados incompletos: items' });
    }
    
    if (!shipping) {
      console.error('❌ Shipping faltando');
      return res.status(400).json({ error: 'Dados incompletos: shipping' });
    }
    
    if (!payment) {
      console.error('❌ Payment faltando');
      return res.status(400).json({ error: 'Dados incompletos: payment' });
    }

    // Calcular valores
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = 1500; // R$ 15,00 em centavos
    const total = subtotal + shippingFee;

    // Gerar número do pedido único
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    console.log('📦 Criando pedido:', orderNumber);

    // 1. Criar/buscar cliente
    let customerId;
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('tax_id', customer.taxId)
      .single();

    if (existingCustomer) {
      customerId = existingCustomer.id;
      
      await supabase
        .from('customers')
        .update({
          name: customer.name,
          email: customer.email,
          phone: customer.phone
        })
        .eq('id', customerId);
    } else {
      const { data: newCustomer, error } = await supabase
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

    console.log('✅ Cliente:', customerId);

    // 2. Criar pedido
    const { data: order, error: orderError } = await supabase
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
        shipping_address: shipping
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    console.log('✅ Pedido criado:', order.id);

    // 3. Criar itens do pedido
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.productId || item.id,
      product_name: item.name,
      product_image: item.image,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    console.log('✅ Itens criados:', orderItems.length);

    // 4. Criar pagamento na Avenpay
    const avenpayApiKey = process.env.AVENPAY_API_KEY;
    
    if (!avenpayApiKey) {
      console.error('❌ AVENPAY_API_KEY não configurada');
      return res.status(500).json({ error: 'Configuração de pagamento ausente' });
    }

    const avenpayPayload = {
      amount: total,
      currency: 'BRL',
      method: payment.method.toUpperCase(), // PIX, CREDIT_CARD, BOLETO
      description: `Pedido ${orderNumber}`,
      externalRef: orderNumber,
      notificationUrl: `https://${req.headers.host}/api/webhooks/avenpay`,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress || '',
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
          country: 'BR',
          state: shipping.state,
          city: shipping.city,
          district: shipping.neighborhood,
          street: shipping.street,
          number: shipping.number,
          zipCode: shipping.zipCode,
          ...(shipping.complement && { complement: shipping.complement })
        }
      }
    };

    console.log('💳 Payload Avenpay:', JSON.stringify(avenpayPayload, null, 2));

    // Se for cartão, adicionar token
    if (payment.method === 'CREDIT_CARD' && payment.cardToken) {
      avenpayPayload.card = {
        token: payment.cardToken,
        installments: payment.installments || 1,
        chargeInterest: false
      };
    }

    console.log('💳 Chamando Avenpay API...');

    // Chamar API da Avenpay
    const avenpayResponse = await fetch('https://api.avenpayments.com/v1/payment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${avenpayApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(avenpayPayload)
    });

    console.log('📡 Status Avenpay:', avenpayResponse.status);
    
    let avenpayData;
    try {
      avenpayData = await avenpayResponse.json();
      console.log('📡 Resposta Avenpay:', JSON.stringify(avenpayData, null, 2));
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse da resposta Avenpay:', parseError);
      const responseText = await avenpayResponse.text();
      console.error('❌ Resposta raw:', responseText);
      throw new Error('Resposta inválida da API de pagamento');
    }

    if (!avenpayResponse.ok) {
      console.error('❌ Erro Avenpay:', avenpayData);
      throw new Error(avenpayData.message || avenpayData.error || 'Erro ao criar pagamento');
    }

    console.log('✅ Pagamento criado na Avenpay:', avenpayData.id);

    // 5. Atualizar pedido com ID do pagamento
    await supabase
      .from('orders')
      .update({
        avenpay_payment_id: avenpayData.id,
        payment_status: avenpayData.status === 'PAID' ? 'paid' : 'pending'
      })
      .eq('id', order.id);

    // 6. Registrar log
    await supabase
      .from('avenpay_webhook_logs')
      .insert([{
        order_id: order.id,
        payment_id: avenpayData.id,
        event_type: 'payment.created',
        status_code: avenpayResponse.status,
        request_body: avenpayPayload,
        response_body: avenpayData
      }]);

    console.log('✅ Pedido completo!');

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
    console.error('❌ Erro ao criar pedido:', error);
    console.error('❌ Stack:', error.stack);
    return res.status(500).json({
      success: false,
      error: 'Erro ao processar pedido',
      message: error.message,
      details: error.toString()
    });
  }
}
