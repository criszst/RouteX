"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
exports.createApp = createApp;
const app_1 = require("./app");
const mergeDescriptors = require("merge-descriptors");
function createApp() {
    const app = function (req, res, next) {
        app.handle(req, res, next);
    };
    mergeDescriptors(app, app_1.app, false);
    app.init();
    return app;
}
exports.app = createApp;
