import { Layer } from "../layer/layer";
import GetOptions from "../types/IProtoype";

import IServerRequest from "../../http/request/IServerRequest";
import IServerResponse from "../../http/response/IServerResponse";

import { RouteCompiler } from "./RouterCompiler";
import { RouterMatcher } from "./RouterMatcher";
import { RouteHandler } from "../types/IRouteHandler";

// routing system for handling HTTP requests


export class Router {
  stack: Layer[];
  private matcher?: RouterMatcher;
  params: Record<string, unknown>;
  caseSensitive: boolean;
  strict: boolean;

  compile() {
    const tree = RouteCompiler.compile(this.stack);
    this.matcher = new RouterMatcher(tree);
  }

  // showLogs(options: { tiny?: boolean; big?: boolean; custom?: boolean; }) {
  //     throw new Error("Method not implemented.");
  // }

  constructor(options: { caseSensitive?: boolean; strict?: boolean } = {}) {
    this.params = {};
    this.stack = [];
    this.caseSensitive = options.caseSensitive || false;
    this.strict = options.strict || false;
  }

  public static showLogsHandler(options: { tiny?: boolean; big?: boolean; custom?: boolean; }) {
      throw new Error("Method not implemented.");
  }

  /**
   * Register a route for HTTP GET method
   * @param path - URL path which the route is registered to
   * @param handlers - functions that will be called when the route is matched
   */

   public get(path: GetOptions["path"], options: { aliases: string | string[] }, handler: RouteHandler): void {
     this.registerRoute(path, options, 'GET', handler)
   }


   /**
   * Register a route for HTTP POST method
   * @param path - URL path which the route is registered to
   * @param handlers - functions that will be called when the route is matched
   */
   public post(path: GetOptions["path"], options: { aliases: string | string[] }, handler: RouteHandler): void {
     this.registerRoute(path, options, 'POST', handler)
   }


  private notFoundHandler!: (req: IServerRequest, res: IServerResponse) => void;

  public setCustom404(handler: (req: IServerRequest, res: IServerResponse) => void): void {
    this.notFoundHandler = handler;
  }


  /**
   * Handles an incoming request and calls the matched route's dispatch function
   * @param req - The incoming request
   * @param res - The response which will be sent back to the client
   * @param out - A function which will be called if no route matches the request. If not provided, a 404 response is sent.
   */
  public handle(req: IServerRequest, res: IServerResponse, out?: Function) {
    if (!this.matcher) throw new Error('Router not compiled');

    const result = this.matcher.match(req.method, req.url)

    if (!result){
      if (this.notFoundHandler) return this.notFoundHandler(req, res)

      res.statusCode = 404;
      return res.end("Page is not found - 404");
    }

    req.params = result.params

   return result.handler.forEach(handler => {
      handler(req, res);
    });

  }


  /**
   * Mounts the given function or functions at the root of the router.
   * The given function or functions will be executed for every incoming request.
   * @param fn - A single function or an array of functions to mount on the root.
   * @returns The router instance, for chaining.
   */
  public use(pathOrHandler: string | Function | Function[], maybeIDKHandler?: Function | Function[]) {

    // in case of use(fn) -> if the use its a function/middleware
    if (typeof pathOrHandler === 'function' || Array.isArray(pathOrHandler)) {
      const handlers = Array.isArray(pathOrHandler) ? pathOrHandler : [pathOrHandler];

      handlers.forEach(handler => {
        this.stack.push(
          new Layer({
            path: '/',
            aliases: ['/'],
            methods: ['ANY'],
            handler: handler as RouteHandler,
            type: 'middleware'
          })
        )
      })

      return this;
    }

    const path = pathOrHandler;
    const handlers = Array.isArray(maybeIDKHandler) ? maybeIDKHandler : [maybeIDKHandler];

    // the undefined type is such a bullshitttt
    const removeNullsOrUndefined = <T>(value: T | undefined | null): value is T => {
      return value != null; // Checks for both undefined and null
    };

    handlers.filter(removeNullsOrUndefined).forEach(handler => {
      this.stack.push(
        new Layer({
          path,
          aliases: [path],
          methods: ['ANY'],
          handler: handler as RouteHandler,
          type: 'middleware'
        })
      )
    })

    return this;
  }


  private registerRoute(path: string, options: { aliases?: string | string[] }, method: string, handler: Function): void {

    const aliases = options.aliases ? Array.isArray(options.aliases) ? options.aliases : [options.aliases] : [];

    this.stack.push(
      new Layer({
        path,
        aliases: [path, ...aliases],
        methods: [method],
        handler: handler as RouteHandler,
        type: 'route'
      })
    )

  }


  rebuild() {
    const tree = RouteCompiler.compile(this.stack);
    this.matcher = new RouterMatcher(tree);
  }

}

export default Router;
