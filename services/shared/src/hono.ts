import { Hono } from "hono";
import { initializeTracing } from "./tracing.js";
import { prometheus } from '@hono/prometheus';
import { HttpBindings } from "@hono/node-server";
import { logger as honoLogger } from 'hono/logger';
import { timeout } from "hono/timeout";
import { contextStorage } from "hono/context-storage";
import { logger } from "./logger.js";

type Env = {
    Bindings:
        & HttpBindings
        & {},
}

export const createApp = (appName: string) => {
    initializeTracing(appName);
    const app = new Hono<Env>();

    app.use(contextStorage())
    app.use(honoLogger((message: string, ...rest: string[]) => {
        logger.info(rest, message);
    }));
    app.use('*', timeout(60_00));

    const { printMetrics, registerMetrics } = prometheus({
        collectDefaultMetrics: {
            gcDurationBuckets: [ 0.05, 0.1, 0.15, 0.2, 0.25, 0.35, 0.45, 0.60, 0.75, 0.9, 1, 1.5, 1.75, 2 ],
            eventLoopMonitoringPrecision: 10,
        },
    });

    return app
        .use('*', registerMetrics)
        .get('/metrics', printMetrics);
}