import { Router } from "../router";

interface App {
    request: any;
    response: any;
    _router: null;
    (req: any, res: any, next: any): void

    init(): void
    handle(req: any, res: any, next: any): void
    listen(port: number, callback: () => void): void
  
    get(path: string, ...handlers: Array<(req: any, res: any, next?: any) => void>): void
    post(path: string, ...handlers: Array<(req: any, res: any, next?: any) => void>): void
    send: (body: any) => void;

    lazyrouter(): void
    
    router: Router
}

export default App;