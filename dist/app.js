"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
exports.createApp = createApp;
const router_1 = require("./router");
const middleware = require('./middleware/init');
const mergeDescriptors = require('merge-descriptors');
/**
 * Prototype for express app
 *
 * With this, we can extend express app methods
 */
const proto = {
    router: {},
    init() {
        this.router = new router_1.Router();
    },
    // enabled() {
    //     return Boolean(this.set(settings));
    // },
    handle(req, res, next) {
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
        this.router.use(middleware.init(this));
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
