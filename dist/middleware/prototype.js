"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proto = void 0;
const router_1 = require("../router");
const middleware = require('./init');
exports.proto = {
    router: {},
    cache: {},
    engines: {},
    settings: {},
    init() {
        this.router = new router_1.Router();
    },
    set(setting, value) {
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
    enabled(setting) {
        return Boolean(this.set(setting, ''));
    },
    handle(req, res, next) {
        this.lazyrouter();
        if (!res.json) {
            res.json = function (body) {
                this.setHeader('Content-Type', 'application/json');
                return this.send(JSON.stringify(body));
            };
        }
        if (!res.send) {
            res.send = function (body) {
                if (typeof body === 'object') {
                    this.setHeader('Content-Type', 'application/json');
                    this.end(JSON.stringify(body), 'utf-8');
                }
                else {
                    this.setHeader('Content-Type', 'text/plain');
                    this.end(body, 'utf-8');
                }
            };
        }
        this.router.handle(req, res, next);
    },
    listen(port, callback) {
        const server = require('http').createServer(this);
        server.listen(port, callback);
    },
    get(path, ...handlers) {
        this.router.get(path, ...handlers);
    },
    post(path, ...handlers) {
        this.router.post(path, ...handlers);
    },
    lazyrouter() {
        if (!this.router) {
            this.router = new router_1.Router({});
            this.router.use(middleware.init(this));
        }
    },
};
