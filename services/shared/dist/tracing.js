import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { KafkaJsInstrumentation, } from 'opentelemetry-instrumentation-kafkajs';
import * as api from '@opentelemetry/api';
import { AsyncHooksContextManager } from '@opentelemetry/context-async-hooks';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';
import { logger } from './logger.js';
export const contextManager = new AsyncHooksContextManager();
contextManager.enable();
api.context.setGlobalContextManager(contextManager);
export function initializeTracing(serviceName) {
    const sdk = new NodeSDK({
        resource: new Resource({
            [ATTR_SERVICE_NAME]: serviceName,
        }),
        traceExporter: new OTLPTraceExporter({
            url: `http://${process.env.HTTP_OTEL_COLLECTOR_HOST}/v1/traces`,
        }),
        metricReader: new PeriodicExportingMetricReader({
            exporter: new OTLPMetricExporter({
                url: `http://${process.env.HTTP_OTEL_COLLECTOR_HOST}/v1/metrics`,
            }),
        }),
        instrumentations: [
            getNodeAutoInstrumentations(),
            new KafkaJsInstrumentation({
                enabled: true,
                consumerHook: (span, topic, message) => {
                    logger.info('kafka consumer hooks');
                    span.setAttribute('kafka.topic', topic);
                    message.partition && span.setAttribute('kafka.partition', message.partition);
                    message.key && span.setAttribute('kafka..key', message.key.toString('utf8'));
                },
                producerHook: (span, topic, message) => {
                    logger.info('kafka producer hooks');
                    span.setAttribute('kafka.topic', topic);
                    message.partition && span.setAttribute('kafka.partition', message.partition);
                    message.key && span.setAttribute('kafka..key', message.key.toString('utf8'));
                }
            }),
            new PinoInstrumentation({
                enabled: true,
            }),
        ],
    });
    sdk.start();
    process.on('SIGTERM', () => {
        sdk.shutdown()
            .then(() => console.log('Tracing terminated'))
            .catch((error) => console.error('Error terminating tracing', error))
            .finally(() => process.exit(0));
    });
}
