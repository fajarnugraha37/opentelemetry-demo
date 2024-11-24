import pino from 'pino';

export const logger = pino.default(
  {
    level: (process.env.LOKI_LOG_LEVEL || 'info'),
    name: process.env.SERVICE_NAME || 'default',
  },
);