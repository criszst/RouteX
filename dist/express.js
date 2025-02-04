"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const router_1 = require("./router");
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
            this.router = new router_1.Router();
        }
    },
    handle(req, res, next) {
        this.lazyrouter();
        if (!res.send) {
            res.send = (body) => {
                console.log(`res.send: ${body}`);
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
    res.send = function (body) {
        console.log(`res.send: ${body}`);
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
