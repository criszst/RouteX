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
        if (this.route && this.route.path === path)
            return true;
        else if (this.name === 'expressInit')
            return true;
        console.log(this.path + ' ' + this.name);
        return false;
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
