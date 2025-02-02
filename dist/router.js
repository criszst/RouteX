"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const route_1 = require("./route");
const layer_1 = require("./layer");
const parseUrl = require('parseurl');
// TODO: generate doc from each method
class Router {
    constructor(options = {}) {
        this.params = {};
        this.stack = [];
        this.caseSensitive = options.caseSensitive || false;
        this.strict = options.strict || false;
    }
    get(path, ...handlers) {
        const route = this.route(path);
        route.get(...handlers);
    }
    post(path, ...handlers) {
        const route = this.route(path);
        route.post(...handlers);
    }
    route(path) {
        const route = new route_1.Route(path);
        const layer = new layer_1.Layer(path, {}, route.dispatch.bind(route));
        layer.route = route;
        this.stack.push(layer);
        return route;
    }
    handle(req, res, out) {
        const self = this;
        const stack = self.stack;
        const next = () => {
            let layer;
            let match;
            let route;
            let idx = 0;
            const path = this.getPathName(req);
            while (match !== true && idx < stack.length) {
                layer = stack[idx++];
                match = this.matchLayer(layer, path);
                route = layer.route;
                if (match !== true) {
                    continue;
                }
                if (!route) {
                    continue;
                }
                route.stack[0].handle_request(req, res, () => { });
            }
        };
        next();
    }
    getPathName(req) {
        try {
            return parseUrl(req).pathname;
        }
        catch (err) {
            return undefined;
        }
    }
    matchLayer(layer, path) {
        try {
            return layer.match(path);
        }
        catch (err) {
            return err;
        }
    }
}
exports.Router = Router;
exports.default = Router;
