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
            res.send = (body) => {
                console.log(`res.send: ${body}`);
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
    Object.setPrototypeOf(app, proto);
    app.init();
    return app;
}
exports.app = createApp;
