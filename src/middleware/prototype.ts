import { isArray } from 'util';
import GetOptions from '../interfaces/IProtoype'

import { Router } from '../router';
import { IncomingMessage, ServerResponse } from 'http';

const middleware = require('./init');

export const proto = {
    router: {} as Router,
    cache: {},
    engines: {},
    settings: {} as string | any,

    init() {
        this.router = new Router();
    },

    set(setting: string, value: String) {
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

    enabled(setting: string) {
        return Boolean(this.set(setting, ''));
    },

    handle(req: IncomingMessage, res: ServerResponse | any, next: any) {
        this.lazyrouter();

        if (!res.json) {
            res.json = function (body: Object | String) {
                this.setHeader('Content-Type', 'application/json');
                return this.send(JSON.stringify(body));
            };
        }

        if (!res.send) {
            res.send = function (body: object | string) {
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

    get(path: GetOptions["path"], ...handlers: GetOptions["handlers"]) {
        this.router.get(path, ...handlers)
    },
    
    post(path: GetOptions["path"], ...handlers: GetOptions["handlers"]) {
        this.router.post(path, ...handlers);
    },

    lazyrouter() {
        if (!this.router) {
            this.router = new Router({});
            this.router.use(middleware.init(this));
          }
    },

};