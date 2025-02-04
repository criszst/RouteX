import App from './interfaces/IApp';
import { Router } from './router';

const middleware = require('./middleware/init');
const mergeDescriptors = require('merge-descriptors');

/**
 * Prototype for express app
 * 
 * With this, we can extend express app methods
 */

const proto = {
    router: {} as Router,

    init() {
        this.router = new Router();
    },

    // enabled() {
    //     return Boolean(this.set(settings));
    // },

    handle(req: any, res: any, next: any) {
        this.router.handle(req, res, next);
    },
    listen(port: number, callback: () => void) {
        const server = require('http').createServer(this);
        server.listen(port, callback);
    },
    get(path: string, ...handlers: Array<(req: any, res: any, next?: any) => void>) {
        this.router.get(path, ...handlers);
    },

    post(path: string, ...handlers: Array<(req: any, res: any, next?: any) => void>) {
        this.router.post(path, ...handlers);
    },

    lazyrouter() {
        this.router.use(middleware.init(this))
    }

};

export function createApp(): App {
    const app: App = function (req, res, next) {
        app.handle(req, res, next);
    } as App;

   
    Object.setPrototypeOf(app, proto);


    app.init();
    return app;
}

export const app = createApp;
