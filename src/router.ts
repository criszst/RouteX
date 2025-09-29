import { IncomingMessage, ServerResponse } from 'http';
import { Route } from './route';
import { Layer } from './layer';
import GetOptions from './interfaces/IProtoype';
import ErrorsDetails from './errors/details';
import { IPMiddleware } from './middleware/ip';

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
  public get(
  path: GetOptions["path"],
  options: { aliases?: string | string[] },
  ...handlers: GetOptions["handlers"]
): void {
  const aliases = options.aliases
    ? Array.isArray(options.aliases)
      ? options.aliases
      : [options.aliases]
    : [];

  // Register the route with the specified path and aliases
  this.registerRoute('get', path, { aliases: [path, ...aliases] }, ...handlers);
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

  private route(path: string, aliases?: string): Route {
    const route = new Route(path);
    const layer = new Layer(path, {}, route.dispatch.bind(route));

    layer.alias = Array.isArray(aliases) ? aliases : [aliases ?? path];

    layer.route = route;
    this.stack.push(layer);
    return route;
  }

  // example: /sendFile redirects to /send and its go on
 
  /**
   * Handles an incoming request and calls the matched route's dispatch function
   * @param req - The incoming request
   * @param res - The response which will be sent back to the client
   * @param out - A function which will be called if no route matches the request. If not provided, a 404 response is sent.
   */
  public handle(req: IncomingMessage, res: ServerResponse, out?: Function): void {
    const stack = this.stack;
    let index = 0;
  
    const next = () => {
      let layer;
      let match;
      let route;
  
      while (match !== true && index < stack.length) {
        const path = this.getPathName(req);
  
        layer = stack[index++];
        match = this.matchLayer(layer, path);
        route = layer.route;
  
        if (match !== true) {
          continue;
        }
  
        if (!route) {
          continue;
        }

        
        IPMiddleware(req, res, () => {});
        route.stack[0].handle_request(req, res, next);
      }
  
      if (!match && out) {
        out();
      } else if (!match) {
        res.statusCode = 404;
        res.end('\n-> This route does not exist');
      }
    };
  
    next();
  }


/**
 * Extracts the pathname from the incoming request object.
 * @param req - The incoming request object.
 * @returns The pathname extracted from the request URL, or undefined if an error occurs.
 */

  private getPathName(req: any): any {
    try {
      return parseUrl(req).pathname;
    }

    catch (err) {
      if (err) {

        if (err instanceof Error) {
          return err.message;
        }
         else {
          return ErrorsDetails.create(
            'Path Error',
            'Path is required', {
            expected: 'non-empty string',
            received: req,
            })
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
  private matchLayer(layer: Layer, path: any): boolean {
    return layer.match(path);
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

  private registerRoute( method: 'get' | 'post', path: string,  options: { aliases: string | string[] }, ...handlers: GetOptions["handlers"]): void {
    
    const aliases = options.aliases ? Array.isArray(options.aliases) ? options.aliases : [options.aliases] : [];

    const route = this.route(path);

    if (method === 'get') {
      aliases.forEach(alias => {
        route.get(alias, ...handlers);
      });
    } 
    
    else if (method === 'post') route.post(...handlers); 
    
    else  throw new Error(`Unsupported method: ${method}`);
    

    let normalizedPath = path;

    if (!this.caseSensitive) {
      normalizedPath = normalizedPath.toLowerCase();
    }
    if (this.strict && !normalizedPath.endsWith('/')) {
      normalizedPath += '/';
    }

    const allAliases = [normalizedPath, ...aliases.filter(also => also !== normalizedPath)];

    const layer = new Layer(normalizedPath, { aliases: allAliases }, route.dispatch.bind(route));

    layer.route = route;
    layer.options.aliases = allAliases;

    this.stack = this.stack.filter(l => l.path !== normalizedPath || l.route?.path !== path);
    this.stack.push(layer);
  }
}

export default Router;