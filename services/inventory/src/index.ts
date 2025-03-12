import { serve } from "@hono/node-server";
import {
  initializeTracing,
  logger,
  kafka,
  gracefullShutdown,
  intializeTopics,
  createApp,
} from "@demo/shared";

// Dummy inventory
const inventory: Record<string, number> = {
  item1: 100,
  item2: 50,
  item3: 75,
};

const app = createApp("inventory-service");

const consumer = await (async () => {
  const prod = kafka.consumer({
    groupId: process.env.KAFKA_GROUP_ID!,
  });

  await intializeTopics();

  await prod.connect();
  await prod.subscribe({ topic: "order-created" });

  await prod.run({
    eachMessage: async ({ message }) => {
      if (message.value) {
        const order = JSON.parse(message.value.toString());
        logger.info(
          { orderId: order.orderId },
          "Processing order for inventory update"
        );
        // Update inventory logic would go here
      }
    },
  });
  return prod;
})();

app.post("/api/inventory/check-inventory", async (c) => {
  const { items } = await c.req.json();

  logger.info({ items }, "Checking inventory");

  for (const item of items) {
    if (!inventory[item.id] || inventory[item.id] < item.quantity) {
      logger.error({ item }, "Insufficient inventory");
      return c.json({ error: "Insufficient inventory" }, 400);
    }
  }

  logger.info("Inventory check successful");
  return c.json({ status: "available" });
});

const server = serve(
  {
    fetch: app.fetch,
    port: +(process.env.PORT || "80"),
  },
  (addr) => {
    logger.info(`Inventory service listening at ${addr.address}:${addr.port}`);
    gracefullShutdown(async (signal) => {
      logger.info(`received ${signal} signl`);
      server.close(
        (err) => err && logger.error("failed to stop server due to ", err)
      );
      server.unref();

      await consumer.disconnect();
    });
  }
);
