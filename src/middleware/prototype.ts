import App from '../interfaces/IApp';
import { Router } from '../router';

const middleware = require('./init');

export const proto = {
    router: {} as Router,
    cache: {},
    engines: {},
    settings: {} as any,

    init() {
        this.router = new Router();
    },

    set(setting: any, value: any) {
        this.settings[setting] = value;

        switch (setting) {
            case 'etag':
                this.set('etag fn', '');
                break;
            case 'query parser':
                this.set('query parser fn', '');
                break;
            case 'trust proxy':
                this.set('trust proxy fn', ''); 
                break;
        }

        return this;
    },

    enabled(setting: any) {
        return Boolean(this.set(setting, ''));
    },

    handle(req: any, res: any, next: any) {
        this.lazyrouter();

        if (!res.json) {
            res.json = function (body: any) {
                this.setHeader('Content-Type', 'application/json');
                return this.send(JSON.stringify(body));
            };
        }

        if (!res.send) {
            res.send = function (body: any) {
                if (typeof body === 'object') {
                    this.setHeader('Content-Type', 'application/json');
                    this.end(JSON.stringify(body), 'utf-8');
                } else {
                    this.setHeader('Content-Type', 'text/plain');
                    this.end(body, 'utf-8');
                }
            };
        }
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
        if (!this.router) {
            this.router = new Router({});
            this.router.use(middleware.init(this));
          }
    },

};