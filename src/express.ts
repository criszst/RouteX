import { app as proto } from './app';
import mergeDescriptors = require("merge-descriptors")


interface App {
    (req: any, res: any, next: any): void;
    init(): void;
    handle(req: any, res: any, next: any): void;
    
    listen(port: number, callback: () => void): void;
    get(path: string, ...handlers: Array<(req: any, res: any, next?: any) => void>): void;
}

export function createApp(): App {
    const app: App = function (req, res, next) {
        app.handle(req, res, next);
    } as App

    mergeDescriptors(app, proto, false);

    app.init();
    return app
}

export const app = createApp