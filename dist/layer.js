"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layer = void 0;
class Layer {
    constructor(path, options, fn) {
        this.handle = fn;
        this.name = fn.name || '<anonymous>';
        this.params = undefined;
        this.path = undefined;
    }
    match(path) {
        return this.path === path;
    }
    handle_request(req, res, next) {
        try {
            this.handle(req, res, next);
        }
        catch (err) {
            console.error(err);
        }
    }
}
exports.Layer = Layer;
