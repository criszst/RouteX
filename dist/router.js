"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const route_1 = require("./route");
const layer_1 = require("./layer");
class Router {
    constructor(options = {}) {
        this.params = {};
        this.stack = [];
        this.caseSensitive = options.caseSensitive || false;
        this.strict = options.strict || false;
    }
    get(path, ...handlers) {
        const route = this.route(path); // Cria ou recupera a rota para o caminho especificado
        route.get(...handlers); // Adiciona os manipuladores de requisição ao stack da rota
    }
    route(path) {
        const route = new route_1.Route(path);
        const layer = new layer_1.Layer(path, {}, route.dispatch.bind(route));
        layer.route = route;
        this.stack.push(layer);
        return route;
    }
    handle(req, res, out) {
        const layer = this.stack[0];
        const route = layer.route;
        if (route && route.stack.length > 0) {
            route === null || route === void 0 ? void 0 : route.stack[0].handle_request(req, res, () => { });
        }
    }
}
exports.Router = Router;
exports.default = Router;
