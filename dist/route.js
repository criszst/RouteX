"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
const layer_1 = require("./layer");
const flatten_1 = require("./libs/flatten");
class Route {
    constructor(path) {
        this.path = path;
        this.stack = [];
        this.methods = {};
    }
    get(...handlers) {
        handlers.forEach((handler) => {
            const layer = new layer_1.Layer(this.path, {}, handler);
            layer.method = 'get';
            this.stack.push(layer);
        });
        this.methods['get'] = true;
    }
    dispatch(req, res, done) { }
    addMethod(method, handlers) {
        const flattenHandlers = (0, flatten_1.flatten)(handlers);
        flattenHandlers.forEach((handler) => {
            if (typeof handler !== 'function') {
                throw new Error('Handler precisa ser uma função.');
            }
            const layer = new layer_1.Layer(this.path, {}, handler);
            layer.method = method;
            this.stack.push(layer);
        });
        this.methods[method] = true;
    }
}
exports.Route = Route;
