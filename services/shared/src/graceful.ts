type ShutdownHandler = (signal: string) => Promise<void>;

export const gracefullShutdown = (handler: ShutdownHandler) => {
    process.addListener('SIGINT', () => handler('SIGINT'));
    process.addListener('SIGTERM', () => handler('SIGTERM'));
}