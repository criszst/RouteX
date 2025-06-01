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
     * @emits console.log - Logs the comparison details including the current time, path, layer path, and aliases.
     * @returns True if the path matches the layer's path or any alias, false otherwise.
     */
    match(path: string): boolean {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const milliseconds = now.getMilliseconds().toString().padStart(3, '0');

      console.log(
        `\x1b[34m->\x1b[0m \x1b[90m[${hours}:${minutes}:${seconds}.${milliseconds}]\x1b[0m  \x1b[36mComparing path\x1b[0m \x1b[35m'${path}'\x1b[0m \x1b[36mwith layer\x1b[0m \x1b[35m'${this.path}'\x1b[0m \x1b[36m[aliases: ${this.alias.join(', ')}]\x1b[0m\n`
      );

      // for example, this console.log will output:
      // -> [14:53:28.871]  Comparing path '/ip' with layer '/my/ip' [aliases: /my/ip, /ip]

      return this.path === path || this.alias.includes(path) || this.path === '*' || this.alias.includes('*');
      }
      
      handle_request(req: IncomingMessage, res: ServerResponse, next: Function): void {
        console.log(`-> Executing handler for ${this.path}`);
        const fn = this.handle;
      
        try {
          fn(req, res, next);
        } catch (err) {
          console.error(`\n-> An error occurred while executing handler for ${this.path}:\n`, err);
          next(err);
        }
      }
}