"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const route_1 = require("./route");
const layer_1 = require("./layer");
const parseUrl = require('parseurl');
// routing system for handling HTTP requests
// handles incoming requests and matching them against registered routes
class Router {
    constructor(options = {}) {
        this.params = {};
        this.stack = [];
        this.caseSensitive = options.caseSensitive || false;
        this.strict = options.strict || false;
    }
    /**
     * Register a route for HTTP GET method
     * @param path - URL path which the route is registered to
     * @param handlers - functions that will be called when the route is matched
     */
    get(path, ...handlers) {
        const route = this.route(path);
        route.get(...handlers);
    }
    /**
     * Register a route for HTTP POST method
     * @param path - URL path which the route is registered to
     * @param handlers - functions that will be called when the route is matched
     */
    post(path, ...handlers) {
        const route = this.route(path);
        route.post(...handlers);
    }
    /**
     * Creates and registers a new route with the specified path.
     * @param path - The URL path for which the route should be registered.
     * @returns A new Route instance associated with the given path.
     */
    route(path) {
        const route = new route_1.Route(path);
        const layer = new layer_1.Layer(path, {}, route.dispatch.bind(route));
        layer.route = route;
        this.stack.push(layer);
        return route;
    }
    /**
     * Handles an incoming request and calls the matched route's dispatch function
     * @param req - The incoming request
     * @param res - The response which will be sent back to the client
     * @param out - A function which will be called if no route matches the request. If not provided, a 404 response is sent.
     */
    handle(req, res, out) {
        const self = this;
        const stack = self.stack;
        let idx = 0;
        const next = () => {
            let layer;
            let match;
            let route;
            while (match !== true && idx < stack.length) {
                const path = this.getPathName(req);
                layer = stack[idx++];
                match = this.matchLayer(layer, path);
                route = layer.route;
                if (match !== true) {
                    continue;
                }
                if (!route) {
                    continue;
                }
                route.stack[0].handle_request(req, res, next);
            }
            if (!match && out) {
                out();
            }
            else if (!match) {
                res.statusCode = 404;
                res.end('This route does not exist');
            }
        };
        next();
    }
    /**
     * Extracts the pathname from the incoming request object.
     * @param req - The incoming request object.
     * @returns The pathname extracted from the request URL, or undefined if an error occurs.
     */
    // TODO: build a beautifuuull error message if an error occurs
    getPathName(req) {
        try {
            return parseUrl(req).pathname;
        }
        catch (err) {
            return undefined;
        }
    }
    /**
     * Attempts to match the given path against the specified layer.
     * If the match is successful, returns true. If an error occurs, returns the error.
     * @param layer - The layer which the path should be matched against.
     * @param path - The path to be matched.
     * @returns True if the path matches, otherwise an error.
     */
    matchLayer(layer, path) {
        try {
            return layer.match(path);
        }
        catch (err) {
            return err;
        }
    }
    /**
     * Mounts the given function or functions at the root of the router.
     * The given function or functions will be executed for every incoming request.
     * @param fn - A single function or an array of functions to mount on the root.
     * @returns The router instance, for chaining.
     */
    use(fn) {
        if (Array.isArray(fn)) {
            fn.forEach((handler) => {
                const layer = new layer_1.Layer('/', {}, handler);
                layer.route = undefined;
                this.stack.push(layer);
            });
        }
        else {
            const layer = new layer_1.Layer('/', {}, fn);
            layer.route = undefined;
            this.stack.push(layer);
        }
        return this;
    }
}
exports.Router = Router;
exports.default = Router;
