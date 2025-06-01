import { Router } from "../router";
import http from "http";

import GetOptions from '../interfaces/IProtoype'


/**
 * Interface representing an application with request handling capabilities.
 */
interface App {
    /**
     * The HTTP request object.
     */
    request: http.IncomingMessage;

    /**
     * The HTTP response object.
     */
    response: http.ServerResponse;

    /**
     * The router instance used for handling routes.
     */
    _router: Router | null;

    /**
     * Function signature for handling requests.
     * @param req - The incoming HTTP request.
     * @param res - The HTTP response object.
     * @param next - A callback function to pass control to the next middleware.
     */
    (req: http.IncomingMessage, 
     res: http.ServerResponse, 
     next: (err?: Error) => void
    ): void

    /**
     * Initializes the application.
     */
    init(): void

    /**
     * Handles an incoming request and passes it to the appropriate route.
     * @param req - The incoming HTTP request.
     * @param res - The HTTP response object.
     * @param next - A callback function to pass control to the next middleware.
     */
    handle(alias: string,
           req: http.IncomingMessage, 
           res: http.ServerResponse, 
           next: (err?: Error) => void
        ): void

    /**
     * Starts the server and listens for incoming connections on the specified port.
     * @param port - The port number to listen on.
     * @param callback - A callback function that is invoked once the server starts listening.
     */
    listen(port: number, callback: () => void): void

    /**
     * Registers a route for the HTTP GET method.
     * @param path - The URL path to register the route on.
     * @param handlers - Functions to handle the route when matched.
     */
    get(path: GetOptions["path"], options: { alias?: string}, ...handlers: GetOptions["handlers"]): void

    /**
     * Registers a route for the HTTP POST method.
     * @param path - The URL path to register the route on.
     * @param handlers - Functions to handle the route when matched.
     */
    post(path: GetOptions["path"], ...handlers: GetOptions["handlers"]): void

    /**
     * Lazily initializes the router if not already initialized.
     */
    lazyrouter(): void

    /**
     * The router instance used for handling routes.
     */
    router: Router
}

export default App;