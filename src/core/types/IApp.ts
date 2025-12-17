import { Router } from "../router/router";
import { IncomingMessage, ServerResponse } from 'http';

import GetOptions from './IProtoype'
import IServerResponse from "../../http/response/IServerResponse";
import IServerRequest from "../../http/request/IServerRequest";
import { RouteHandler } from "./IRouteHandler";


/**
 * Interface representing an application with request handling capabilities.
 */
interface App {

    /**
    * Mounts the specified middleware function or functions at the specified path.
    */
      use(path?: string, ...handlers: Function[]): void


    /**
     * The HTTP request object.
     */
     request: IncomingMessage;

    /**
     * The HTTP response object.
     */
     response: ServerResponse;

    /**
     * The router instance used for handling routes.
     */
     _router: Router;

    /**
     * Function signature for handling requests.
     * @param req - The incoming HTTP request.
     * @param res - The HTTP response object.
     * @param next - A callback function to pass control to the next middleware.
     */
     (req: IncomingMessage,
      res: ServerResponse,
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
     handle(
           req: IncomingMessage,
           res: ServerResponse,
           next?: (err?: Error) => void
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
     * @param options - Optional configuration options for the route.
     * @param handlers - Functions to handle the route when matched.
     */
     get(path: GetOptions["path"], options: { aliases?: string | string[] }, ...handlers: RouteHandler[]): void

    /**
     * Registers a route for the HTTP POST method.
     * @param path - The URL path to register the route on.
     * @param options - Optional configuration options for the route.
     * @param handlers - Functions to handle the route when matched.
     */
     post(path: GetOptions["path"], options: { aliases?: string | string[] }, ...handlers: RouteHandler[]): void

    /**
     * Lazily initializes the router if not already initialized.
     */
     lazyrouter(): void

    /**
     * The router instance used for handling routes.
     */
     router: Router

     showLogs(options: {tiny?: boolean, big?: boolean, custom?: boolean}): void

    /**
    * Sets a custom 404 error handler.
    * @param handler - The handler function to be invoked when a 404 error occurs.
    */
     setCustom404(handler: (req: IServerRequest, res: IServerResponse) => void): void;


}

export default App;
