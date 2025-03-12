import { trace } from '@opentelemetry/api';
import pino from 'pino';
export const logger = pino.default({
    level: (process.env.LOKI_LOG_LEVEL || 'info'),
    name: process.env.SERVICE_NAME || 'default',
    mixin() {
        const activeSpan = trace.getActiveSpan();
        if (!activeSpan || !activeSpan.spanContext()) {
            return {
                trace_id: null,
                span_id: null
            };
        }
        const context = activeSpan.spanContext();
        return {
            trace_id: context.traceId,
            span_id: context.spanId,
        };
    }
});
