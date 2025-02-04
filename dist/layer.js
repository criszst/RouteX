"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layer = void 0;
class Layer {
    constructor(path, options, fn) {
        this.handle = fn;
        this.name = fn.name || '<anonymous>';
        this.params = undefined;
        this.path = path;
    }
    match(path) {
        console.log(`-> Comparando path: ${path} com layer path: ${this.path}\n`);
        return this.path === path || this.path === '*';
    }
    handle_request(req, res, next) {
        console.log(`-> Executando handler para ${this.path}`);
        const fn = this.handle;
        try {
            fn(req, res, next);
        }
        catch (err) {
            console.error(`\n-> Erro ao executar handler para ${this.path}:\n`, err);
            next(err);
        }
    }
}
exports.Layer = Layer;
