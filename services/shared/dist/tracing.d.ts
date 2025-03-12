import { AsyncHooksContextManager } from '@opentelemetry/context-async-hooks';
export declare const contextManager: AsyncHooksContextManager;
export declare function initializeTracing(serviceName: string): void;
