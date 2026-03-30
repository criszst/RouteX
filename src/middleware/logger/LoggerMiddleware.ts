export default class LoggerMiddleware {
    constructor() {
        this.middleware = this.middleware.bind(this);
    }

  // TODO: fix this later
    async middleware(logger: string, context: Number, next: NonNullable<Function>) {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
    };
}

export const loggerMiddleware = new LoggerMiddleware().middleware;
