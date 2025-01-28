"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
exports.createApp = createApp;
const router_1 = require("./router");
const mergeDescriptors = require('merge-descriptors');
const proto = {
    router: {},
    init() {
        this.router = new router_1.Router();
    },
    handle(req, res, next) {
        this.router.handle(req, res, next);
    },
    listen(port, callback) {
        const server = require('http').createServer(this);
        server.listen(port, callback);
    },
    get(path, ...handlers) {
        this.router.get(path, ...handlers);
    }
};
function createApp() {
    const app = function (req, res, next) {
        app.handle(req, res, next);
    };
    Object.setPrototypeOf(app, proto);
    app.init();
    return app;
}
exports.app = createApp;
