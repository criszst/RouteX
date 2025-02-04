import { IncomingMessage, ServerResponse } from 'http';
import { Route } from './route';

export class Layer {
    handle: Function;
    name: string;
    params: any;
    path: string | undefined;
    method?: string;
    route?: Route;

    constructor(path: string, options: Record<string, unknown>, fn: Function) {
        this.handle = fn;
        this.name = fn.name || '<anonymous>';
        this.params = undefined;
        this.path = undefined;
    }

    match(path: string): boolean | string {
        if (this.route && this.route.path === path) return true;
        
        else if (this.name === 'expressInit') return true

        console.log(this.path + ' ' + this.name);

        return false
    }

    handle_request(req: IncomingMessage, res: ServerResponse, next: Function): void {
        const fn = this.handle

        try {
            fn(req, res, next);
        } catch (err) {
            console.error(err);
        }
    }
}