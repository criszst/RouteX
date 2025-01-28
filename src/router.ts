import { IncomingMessage, ServerResponse } from 'http';
import { Route } from './route';
import { Layer } from './layer';

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

  route(path: string): Route {
    const route = new Route(path);
    const layer = new Layer(path, {}, route.dispatch.bind(route));

    layer.route = route;
    this.stack.push(layer);
    return route;
  }

  handle(req: IncomingMessage, res: ServerResponse, out?: Function) {
    const layer = this.stack[0];
    const route = layer.route;

    if (route && route.stack.length > 0) {
      route?.stack[0].handle_request(req, res, () => {});
    }
  }
}

export default Router;