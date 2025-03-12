export const gracefullShutdown = (handler) => {
    process.addListener('SIGINT', () => handler('SIGINT'));
    process.addListener('SIGTERM', () => handler('SIGTERM'));
};
