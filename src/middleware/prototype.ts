import { isArray } from 'util';
import GetOptions from '../interfaces/IProtoype'

import { Router } from '../router';
import { IncomingMessage, ServerResponse } from 'http';

import mime from 'mime';
import { Response } from '../server/response';

const middleware = require('./init');

export const prototype = {
    router: {} as Router,
    cache: {},
    engines: {},
    settings: {} as string | any,

    init() {
        this.router = new Router();
    },

    set(setting: string, value: String): Object {
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

    enabled(setting: string): boolean {
        return Boolean(this.set(setting, ''));
    },



    handle(req: IncomingMessage, res: ServerResponse | any, next: any): void {
        this.lazyrouter();

        Response.send(res);
        Response.json(res);
        Response.download(res);

        this.router.handle(req, res, next);
    },

    listen(port: number, callback: () => void) {
        const server = require('http').createServer(this);
        server.listen(port, callback);
    },

    get(path: GetOptions["path"], ...handlers: GetOptions["handlers"]): void {
        this.router.get(path, ...handlers)
    },

    post(path: GetOptions["path"], ...handlers: GetOptions["handlers"]): void {
        this.router.post(path, ...handlers);
    },


    lazyrouter(): void {
        if (!this.router) {
            this.router = new Router({});
            this.router.use(middleware.init(this));
        }
    },

};