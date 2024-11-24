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

    const { printMetrics, registerMetrics } = prometheus();

    return app
        .use('*', registerMetrics)
        .get('/metrics', printMetrics);
}