import { IncomingMessage, ServerResponse } from 'http';
import { Route } from './route';

export class Layer {
    handle: Function;
    name: string;
    params: any;
    path: string;
    method?: string;
    route?: Route;

    constructor(path: string, options: Record<string, unknown>, fn: Function) {
        this.handle = fn;
        this.name = fn.name || '<anonymous>';
        this.params = undefined;
        this.path = path;
    }

    match(path: string): boolean {
        console.log(`-> Comparando path: ${path} com layer path: ${this.path}\n`);
        return this.path === path || this.path === '*';
      }
      
      handle_request(req: IncomingMessage, res: ServerResponse, next: Function): void {
        console.log(`-> Executando handler para ${this.path}`);
        const fn = this.handle;
      
        try {
          fn(req, res, next);
        } catch (err) {
          console.error(`\n-> Erro ao executar handler para ${this.path}:\n`, err);
          next(err);
        }
      }
}