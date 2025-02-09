import { IncomingMessage, ServerResponse } from 'http';
import { Route } from './route';
import { Layer } from './layer';
import GetOptions from './interfaces/IProtoype';
const parseUrl = require('parseurl');

// TODO: generate doc from each method
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


  public get(path: GetOptions["path"], ...handlers: GetOptions["handlers"]): void {
    const route = this.route(path);
    route.get(...handlers);
  }

  public post(path: GetOptions["path"], ...handlers: GetOptions["handlers"]): void {
    const route = this.route(path);
    route.post(...handlers);

  }

  private route(path: string): Route {
    const route = new Route(path);
    const layer = new Layer(path, {}, route.dispatch.bind(route));

    layer.route = route;
    this.stack.push(layer);
    return route;
  }

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
        out(); // Call the outer layer's next function
      } else if (!match) {
        res.statusCode = 404;
        res.end('Not Found');
      }
    };
  
    next();
  }

 private getPathName(req: any): any {
    try {
      return parseUrl(req).pathname;
    }

    catch (err) {
      return undefined;
    }
  }

  private matchLayer(layer: Layer, path: any) {
    try {
      return layer.match(path);
    } catch (err) {
      return err;
    }
  }



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


}

export default Router;