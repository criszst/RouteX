"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const router_1 = require("./router");
const middleware = require("./middleware/init");
const http = require("http");
const mixin = require("merge-descriptors");
const proto = {
    router: {},
    _router: null,
    init() {
        this.router = new router_1.Router();
    },
    lazyrouter() {
        if (!this.router) {
            this.router = new router_1.Router({});
            this.router.use(middleware.init(this));
        }
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
        const server = http.createServer(this);
        return server.listen(port, callback);
    },
    get(path, ...handlers) {
        this.lazyrouter();
        this.router.get(path, ...handlers);
    },
    post(path, ...handlers) {
        this.lazyrouter();
        this.router.post(path, ...handlers);
    }
};
function createApp() {
    const app = ((req, res, next) => {
        app.handle(req, res, next);
    });
    mixin(app, proto, false);
    const req = Object.create(http.IncomingMessage.prototype);
    const res = Object.create(http.ServerResponse.prototype);
    app.response = Object.create(http.ServerResponse.prototype);
    app.response.send = function (body) {
        if (typeof body === 'object') {
            this.setHeader('Content-Type', 'application/json');
            this.end(JSON.stringify(body), 'utf-8');
        }
        else {
            this.setHeader('Content-Type', 'text/plain');
            this.end(body, 'utf-8');
        }
    };
    app.response.json = function (body) {
        this.setHeader('Content-Type', 'application/json');
        return this.send(JSON.stringify(body));
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
    app.init();
    return app;
}
exports.app = createApp();
