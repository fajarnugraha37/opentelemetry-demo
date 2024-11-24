import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { v4 as uuidv4 } from 'uuid';
import { initializeTracing, logger, kafka, gracefullShutdown, useMetrics, intializeTopics, serviceEndpoint } from '@demo/shared';

initializeTracing('order-service');

const producer = kafka.producer();
await producer.connect();
await intializeTopics();


const app = useMetrics(new Hono());

// Update the path to handle the nginx prefix
app.post('/api/orders', async (c) => {
  const orderId = uuidv4();
  const { items } = await c.req.json();
  
  logger.info({ orderId, items }, 'New order received');

  // Update service URLs to use internal docker network names
  const inventoryResponse = await fetch(`${serviceEndpoint.inventory}/api/inventory/check-inventory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });

  if (!inventoryResponse.ok) {
    logger.error({ orderId }, 'Inventory check failed');
    return c.json({ error: 'Inventory check failed' }, 400);
  }

  const paymentResponse = await fetch(`${serviceEndpoint.payment}/api/payment/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, amount: 100 }), // Dummy amount
  });

  if (!paymentResponse.ok) {
    logger.error({ orderId }, 'Payment failed');
    return c.json({ error: 'Payment failed' }, 400);
  }

  await producer.send({
    topic: 'order-created',
    messages: [{ 
      key: orderId,
      value: JSON.stringify({ orderId, items, status: 'created' })
    }],
  });

  logger.info({ orderId }, 'Order processed successfully');
  return c.json({ orderId, status: 'created' });
});

const server = serve({
  fetch: app.fetch,
  port: +(process.env.PORT || '80'),
}, (addr) => {
  logger.info(`Order Service  listening at ${addr.address}:${addr.port}`);
  gracefullShutdown(async (signal) => {
      logger.info(`received ${signal} signl`);
      server.close(err => err && logger.error('failed to stop server due to ', err));
      server.unref();

      producer.disconnect();
  });
});