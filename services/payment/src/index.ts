import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { gracefullShutdown, initializeTracing, logger, useMetrics } from '@demo/shared';

initializeTracing('payment-service');

const app = useMetrics(new Hono());

// Update the path to handle the nginx prefix
app.post('/api/payment/process', async (c) => {
  const { orderId, amount } = await c.req.json();
  
  logger.info({ orderId, amount }, 'Processing payment');

  // Simulate payment processing
  const success = Math.random() > 0.1; // 90% success rate

  if (!success) {
    logger.error({ orderId }, 'Payment failed');
    return c.json({ error: 'Payment failed' }, 400);
  }

  logger.info({ orderId }, 'Payment successful');
  return c.json({ status: 'success', transactionId: `tx-${orderId}` });
});

const server = serve({
  fetch: app.fetch,
  port: +(process.env.PORT || '80'),
}, (addr) => {
  logger.info(`Payment service listening at ${addr.address}:${addr.port}`);
  gracefullShutdown(async (signal) => {
      logger.info(`received ${signal} signl`);
      server.close(err => err && logger.error('failed to stop server due to ', err));
      server.unref();
  });
});