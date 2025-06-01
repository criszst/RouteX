import { IncomingMessage, ServerResponse } from 'http';
import { Route } from './route';

export class Layer {
    handle: Function;
    name: string;
    params: any;
    path: string;
    method?: string;
    route?: Route;
    options: Record<string, unknown>;
    alias: string[];

    constructor(path: string, options: Record<string, unknown>, fn: Function) {
        this.handle = fn;
        this.name = fn.name || '<anonymous>';
        this.params = undefined;
        this.path = path;
        this.options = options;
        this.alias = options.aliases ? (Array.isArray(options.aliases) ? options.aliases : [options.aliases]) : [];
    }

    /**
     * Checks if the given path matches the layer's path or any of its aliases.
     * Logs the comparison process to the console.
     * 
     * @param path - The path to be compared against the layer's path and aliases.
     * @returns True if the path matches the layer's path or any alias, false otherwise.
     */

    match(path: string): boolean {
        console.log(`-> Comparing path ${path} with layer ${this.path} [aliases: ${this.alias.join(', ')}]\n`);

        return this.path === path || this.alias.includes(path) || this.path === '*' || this.alias.includes('*');
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