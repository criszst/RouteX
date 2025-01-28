"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const router_1 = require("./router");
const mergeDescriptors = require("merge-descriptors");
const prototype = {
    router: {},
    init() {
        this.router = new router_1.Router();
    },
    handle(req, res, next) {
        this.router.handle(req, res, next);
    },
    listen(port, callback) {
        const server = require("http").createServer(this);
        return server.listen(port, callback);
    },
    get(path, ...handlers) {
        this.router.get(path, ...handlers);
    },
};
function createApp() {
    const app = ((req, res, next) => {
        app.handle(req, res, next);
    });
    mergeDescriptors(app, prototype, false);
    app.init();
    return app;
}
exports.app = createApp();
