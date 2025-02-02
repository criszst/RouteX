import { IncomingMessage, ServerResponse } from 'http';
import { Route } from './route';
import { Layer } from './layer';
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

  get(path: string, ...handlers: Array<(req: IncomingMessage, res: ServerResponse, next?: Function) => void>): void {
    const route = this.route(path);
    route.get(...handlers);
  }

  post(path: string, ...handlers: Array<(req: IncomingMessage, res: ServerResponse, next?: Function) => void>): void {
    const route = this.route(path);
    route.post(...handlers);

  }

  route(path: string): Route {
    const route = new Route(path);
    const layer = new Layer(path, {}, route.dispatch.bind(route));

    layer.route = route;
    this.stack.push(layer);
    return route;
  }

  handle(req: IncomingMessage, res: ServerResponse, out?: Function): void {
    const self = this;
    const stack = self.stack;


    const next = () => {
      let layer;
      let match;
      let route;

      let idx = 0;

      const path = this.getPathName(req);

      while (match !== true && idx < stack.length) {
        layer = stack[idx++];
        match = this.matchLayer(layer, path);
        route = layer.route;
  
        if (match !== true) {
          continue;
        }
  
    
        if (!route) {
          continue;
        }
  
        route.stack[0].handle_request(req, res, () => { });
      }
      
    }

    next();
  }

  getPathName(req: any): any {
    try {
      return parseUrl(req).pathname;
    }

    catch (err) {
      return undefined;
    }
  }

  matchLayer(layer: Layer, path: any) {
    try {
      return layer.match(path);
    } catch (err) {
      return err;
    }
  }
}

export default Router;