import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { initializeTracing, logger, kafka, gracefullShutdown, useMetrics, intializeTopics } from '@demo/shared';

initializeTracing('inventory-service');

// Dummy inventory
const inventory: Record<string, number> = {
  'item1': 100,
  'item2': 50,
  'item3': 75,
};

const app = useMetrics(new Hono());

// Update the path to handle the nginx prefix
app.post('/api/inventory/check-inventory', async (c) => {
  const { items } = await c.req.json();

  logger.info({ items }, 'Checking inventory');

  for (const item of items) {
    if (!inventory[item.id] || inventory[item.id] < item.quantity) {
      logger.error({ item }, 'Insufficient inventory');
      return c.json({ error: 'Insufficient inventory' }, 400);
    }
  }

  logger.info('Inventory check successful');
  return c.json({ status: 'available' });
});

async function setupConsumer() {
  await intializeTopics();

  const consumer = kafka.consumer({ 
    groupId: process.env.KAFKA_GROUP_ID!,
  });
  await consumer.connect();
  await consumer.subscribe({ topic: 'order-created' });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (message.value) {
        const order = JSON.parse(message.value.toString());
        logger.info({ orderId: order.orderId }, 'Processing order for inventory update');
        // Update inventory logic would go here
      }
    },
  });
}

setupConsumer().catch(console.error);

const server = serve({
  fetch: app.fetch,
  port: +(process.env.PORT || '80'),
}, (addr) => {
  logger.info(`Inventory service listening at ${addr.address}:${addr.port}`);
  gracefullShutdown(async (signal) => {
    logger.info(`received ${signal} signl`);
    server.close(err => err && logger.error('failed to stop server due to ', err));
    server.unref();
  });
});