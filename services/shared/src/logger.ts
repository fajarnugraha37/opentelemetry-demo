import pino from 'pino';
import type { LokiOptions } from 'pino-loki';


export const logger = pino.default(
  {
    level: (process.env.LOKI_LOG_LEVEL || 'info'),
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
      interval: +(process.env.LOKI_LOG_INTERVAL || '15'),
      host: process.env.HTTP_LOKI_ENDPOINT!,
    },
  }),
);