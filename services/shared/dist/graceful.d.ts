type ShutdownHandler = (signal: string) => Promise<void>;
export declare const gracefullShutdown: (handler: ShutdownHandler) => void;
export {};
