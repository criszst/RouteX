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
        var _a;
        console.log(this.path + ' ' + this.name);
        return ((_a = this.route) === null || _a === void 0 ? void 0 : _a.path) === path;
    }
    handle_request(req, res, next) {
        const fn = this.handle;
        try {
            fn(req, res, next);
        }
        catch (err) {
            console.error(err);
        }
    }
}
exports.Layer = Layer;
