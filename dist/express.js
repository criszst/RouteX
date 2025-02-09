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
    const appReference = (obj) => {
        return Object.create(obj, {
            app: {
                configurable: true,
                enumerable: true,
                writable: true,
                value: app,
            },
        });
    };
    (0, merge_1.merge)(app, prototype_1.prototype, false);
    const req = Object.create(http_1.IncomingMessage.prototype);
    const res = Object.create(http_1.ServerResponse.prototype);
    app.request = Object.create(req, appReference.prototype);
    app.response = Object.create(res, appReference.prototype);
    app.init();
    return app;
}
exports.app = createApp();
