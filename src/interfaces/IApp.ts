import { Router } from "../router";
import http from "http";

import GetOptions from '../interfaces/IProtoype'

interface App {
    request: http.IncomingMessage | any;
    response: http.ServerResponse | any;
    _router: Router | null;

    (req: http.IncomingMessage, 
     res: http.ServerResponse, 
     next: (err?: Error) => void
    ): void

    init(): void
    
    handle(req: http.IncomingMessage, 
           res: http.ServerResponse, 
           next: (err?: Error) => void
        ): void

    listen(port: number, callback: () => void): void

    get(path: GetOptions["path"], ...handlers: GetOptions["handlers"]): void
    post(path: GetOptions["path"], ...handlers: GetOptions["handlers"]): void
    send: (body: object | string) => void;

    download(path: string): void;

    lazyrouter(): void
    
    router: Router
}

export default App;