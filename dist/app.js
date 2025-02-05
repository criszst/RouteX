"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
exports.createApp = createApp;
const router_1 = require("./router");
const middleware = require('./middleware/init');
const http = require("http");
const mixin = require("merge-descriptors");
const setPrototypeOf = require('setprototypeof');
/**
 * Prototype for express app
 *
 * With this, we can extend express app methods
 */
const proto = {
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
        if (!res.send) {
            res.send = function (body) {
                if (typeof body === 'object') {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(body), 'utf-8');
                }
                else {
                    res.setHeader('Content-Type', 'text/plain');
                    res.end(body, 'utf-8');
                }
            };
        }
        if (!res.json) {
            res.json = function (body) {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(body));
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
function createApp() {
    const app = function (req, res, next) {
        app.handle(req, res, next);
    };
    const req = Object.create(http.IncomingMessage.prototype);
    const res = Object.create(http.ServerResponse.prototype);
    app.response = res;
    res.send = function (body) {
        if (typeof body === 'object') {
            this.setHeader('Content-Type', 'application/json');
            this.end(JSON.stringify(body), 'utf-8');
        }
        else {
            this.setHeader('Content-Type', 'text/plain');
            this.end(body, 'utf-8');
        }
        return this;
    };
    res.json = function (body) {
        this.setHeader('Content-Type', 'application/json');
        this.end(JSON.stringify(body));
        return this;
    };
    app.request = Object.create(req, {
        app: {
            configurable: true,
            enumerable: true,
            writable: true,
            value: app,
        }
    });
    app.response = Object.create(res, {
        app: {
            configurable: true,
            enumerable: true,
            writable: true,
            value: app,
        }
    });
    Object.setPrototypeOf(app, proto);
    app.init();
    return app;
}
exports.app = createApp;
