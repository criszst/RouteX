import { IncomingMessage, ServerResponse } from 'http';
import { Route } from './route';
import { Layer } from './layer';
import GetOptions from './interfaces/IProtoype';
import ErrorsDetails from './errors/details';
const parseUrl = require('parseurl');

// routing system for handling HTTP requests
// handles incoming requests and matching them against registered routes

export class Router {
  stack: Layer[];
  params: Record<string, unknown>;
  caseSensitive: boolean;
  strict: boolean;

  constructor(options: { caseSensitive?: boolean; strict?: boolean } = {}) {
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
  public get(path: GetOptions["path"], options: { aliases?: string[]}, ...handlers: GetOptions["handlers"]): void {

    if (typeof options.aliases === 'object') {
      const mainHandler = handlers[0];
      const alias = options.aliases;

      if (alias) {
        const aliases = Array.isArray(alias) ? alias : [alias];
        aliases.forEach(a => this.registerRoute('get', a, mainHandler));
      }

      this.registerRoute('get', path, mainHandler);
    } 
    

    // TODO: provide register route method
      const route = this.route(path);
      route.get(...handlers);
    
  }



  /**
   * Register a route for HTTP POST method
   * @param path - URL path which the route is registered to
   * @param handlers - functions that will be called when the route is matched
   */
  
  public post(path: GetOptions["path"], ...handlers: GetOptions["handlers"]): void {
    const route = this.route(path);
    route.post(...handlers);

  }

  
  /**
   * Creates and registers a new route with the specified path.
   * @param path - The URL path for which the route should be registered.
   * @returns A new Route instance associated with the given path.
   */

  private route(path: string): Route {
    const route = new Route(path);
    const layer = new Layer(path, {}, route.dispatch.bind(route));

    layer.route = route;
    this.stack.push(layer);
    return route;
  }


  // TODO: create a alias to some routes and match against the main router
  // example: /sendFile redirects to /send and its go on
 
  /**
   * Handles an incoming request and calls the matched route's dispatch function
   * @param req - The incoming request
   * @param res - The response which will be sent back to the client
   * @param out - A function which will be called if no route matches the request. If not provided, a 404 response is sent.
   */
  public handle(req: IncomingMessage, res: ServerResponse, out?: Function): void {
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
      } else if (!match) {
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

  private getPathName(req: any): any {
    try {
      return parseUrl(req).pathname;
    }

    catch (err) {
      if (err) {
        if (err instanceof Error) {
          return err.message;
        } else {
          return 'An unknown error occurred: \n' + err;
        }
      } else {

        return ErrorsDetails.create(
          'Path Error',
          'Path is required', {
          expected: 'non-empty string',
          received: req,
        })

      }
    }
  }

  
  /**
   * Attempts to match the given path against the specified layer.
   * If the match is successful, returns true. If an error occurs, returns the error.
   * @param layer - The layer which the path should be matched against.
   * @param path - The path to be matched.
   * @returns True if the path matches, otherwise an error.
   */
  private matchLayer(layer: Layer, path: any) {
    try {
      return layer.match(path);
    } catch (err) {
      return err;
    }
  }



  /**
   * Mounts the given function or functions at the root of the router.
   * The given function or functions will be executed for every incoming request.
   * @param fn - A single function or an array of functions to mount on the root.
   * @returns The router instance, for chaining.
   */
  public use(fn: Function | Function[]): Router {
    if (Array.isArray(fn)) {
      fn.forEach((handler) => {
        const layer = new Layer('/', {}, handler);
        layer.route = undefined;
        this.stack.push(layer);
      });
    } else {
      const layer = new Layer('/', {}, fn);
      layer.route = undefined;
      this.stack.push(layer);
    }
  
    return this;
  }

  private registerRoute(method: 'get' | 'post', path: string, handler: Function) {
  const route = this.route(path);
  route[method](handler);
}


}

export default Router;
