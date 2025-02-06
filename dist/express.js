"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const prototype_1 = require("./middleware/prototype");
const merge_1 = require("./libs/merge");
const http_1 = require("http");
function createApp() {
    const app = ((req, res, next) => {
        app.handle(req, res, next);
    });
    (0, merge_1.merge)(app, prototype_1.prototype, false);
    const req = Object.create(http_1.IncomingMessage.prototype);
    const res = Object.create(http_1.ServerResponse.prototype);
    app.request = Object.create(http_1.ServerResponse.prototype);
    app.response = Object.create(http_1.ServerResponse.prototype);
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
