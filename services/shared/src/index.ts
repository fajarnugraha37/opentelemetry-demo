import { prometheus } from '@hono/prometheus';
import { Hono } from 'hono';

export * from './graceful.js';
export * from './kafka.js';
export * from './logger.js';
export * from './tracing.js';


const { printMetrics, registerMetrics } = prometheus();

export const useMetrics = (app: Hono) => app
    .use('*', registerMetrics)
    .get('/metrics', printMetrics)