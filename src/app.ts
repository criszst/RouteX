import { Router } from './router';
const mergeDescriptors = require('merge-descriptors');

const proto = {
    router: {} as Router,

    init() {
        this.router = new Router();
    },
    handle(req: any, res: any, next: any) {
        this.router.handle(req, res, next);
    },
    listen(port: number, callback: () => void) {
        const server = require('http').createServer(this);
        server.listen(port, callback);
    },
    get(path: string, ...handlers: Array<(req: any, res: any, next?: any) => void>) {
        this.router.get(path, ...handlers);
    }
};

interface App {
    (req: any, res: any, next: any): void;
    init(): void;
    handle(req: any, res: any, next: any): void;
    listen(port: number, callback: () => void): void;
    get(path: string, ...handlers: Array<(req: any, res: any, next?: any) => void>): void;
    router: Router; 
}


export function createApp(): App {
    const app: App = function (req, res, next) {
        app.handle(req, res, next);
    } as App;

   
    Object.setPrototypeOf(app, proto);


    app.init();
    return app;
}

export const app = createApp;
