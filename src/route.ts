import { IncomingMessage, ServerResponse } from 'http';
import { Layer } from './layer';
import { flatten } from './libs/flatten';

export class Route {
  path: string;
  stack: Layer[];
  methods: Record<string, boolean>;

  constructor(path: string) {
    this.path = path;
    this.stack = [];
    this.methods = {};
  }

  get(...handlers: Array<Function>): void {
    handlers.forEach((handler) => {
      const layer = new Layer(this.path, {}, handler);
      layer.method = 'get';
      this.stack.push(layer);
    });
    this.methods['get'] = true;
  }
  

  dispatch(req: IncomingMessage, res: ServerResponse, done: () => void): void { }

  private addMethod(method: string, handlers: Function[]): void {
    const flattenHandlers = flatten(handlers);

    flattenHandlers.forEach((handler) => {
      if (typeof handler !== 'function') {
        throw new Error('Handler precisa ser uma função.');
      }

      const layer = new Layer(this.path, {}, handler);
      layer.method = method;
      this.stack.push(layer);
    });

    this.methods[method] = true;
  }
}
