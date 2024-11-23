import pino from 'pino';
import type { LokiOptions } from 'pino-loki';


export const logger = pino.default(
  {
    level: 'debug',
    name: process.env.SERVICE_NAME || 'default',
  }, 
  pino.transport<LokiOptions>({
    target: "pino-loki",
    options: {
      labels: { 
        service_name: process.env.SERVICE_NAME || 'default',
      },
      propsToLabels: ['level', 'pid'],
      batching: true,
      interval: 15,
      host: 'http://loki:3100',
    },
  }),
);