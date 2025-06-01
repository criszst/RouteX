import GetOptions from '../interfaces/IProtoype'

import { Router } from '../router';
import { IncomingMessage, ServerResponse } from 'http';

import { Response } from '../server/response';

const middleware = require('./init');

export const prototype = {
  router: {} as Router,
  cache: {},
  engines: {},
  settings: {} as string | any,

  init() {
    this.router = new Router();
  },

  /**
   * Sets setting `setting` to `value`, or return the setting's value.
   * If `value` is not provided, return the setting's value.
   * Otherwise, set `value` as the setting's value.
   * If `setting` is one of "etag fn", "query parser fn", or "trust proxy fn", set it to an empty string.
   * @param setting The setting to set
   * @param value The value to set
   * @returns This
   */
  set(setting: string, value: String): Object {
    this.settings[setting] = value;

    switch (setting) {
      case 'etag':
        this.set('etag fn', '');
        break;
      case 'query parser':
        this.set('query parser fn', '');
        break;
      case 'trust proxy':
        this.set('trust proxy fn', '');
        break;
    }

    return this;
  },

  /**
   * Checks if a setting is enabled.
   * 
   * @param setting The setting to check.
   * @returns True if the setting is enabled; otherwise, false.
   */

  enabled(setting: string): boolean {
    return Boolean(this.set(setting, ''));
  },



  /**
   * Handles an incoming request, sets up the response methods,
   * and delegates request handling to the router.
   *
   * @param req - The incoming HTTP request.
   * @param res - The HTTP response object to be sent back to the client.
   * @param next - A callback function to pass control to the next middleware.
   */

  handle(req: IncomingMessage, res: ServerResponse | any, next: any): void {
    this.lazyrouter();

    Response.send(res);
    Response.json(res);
    Response.download(res);
    Response.redirect(res);
    Response.sendFile(res)

    this.router.handle(req, res, next);
  },



  /**
   * Starts an HTTP server listening for connections on the specified port.
   * Once the server starts listening, the provided callback function is invoked.
   *
   * @param port - The port number on which the server should listen for incoming connections.
   * @param callback - A function to be executed when the server starts listening on the specified port.
   */

  listen(port: number, callback: () => void) {
    const server = require('http').createServer(this);
    server.listen(port, callback)
  },

  
  /**
   * Register a route for HTTP GET method
   * @param path - URL path which the route is registered to
   * @param handlers - functions that will be called when the route is matched
   */
  get(path: GetOptions["path"], options: { aliases?: string}, ...handlers: GetOptions["handlers"]): void {
    this.router.get(
      path, 
      options.aliases ? { aliases: Array.isArray(options.aliases) ? options.aliases : [options.aliases] } : {}, 
    ...handlers
  )
  },


  /**
   * Register a route for HTTP POST method
   * @param path - URL path which the route is registered to
   * @param handlers - functions that will be called when the route is matched
   */
  post(path: GetOptions["path"], ...handlers: GetOptions["handlers"]): void {
    this.router.post(path, ...handlers);
  },


  /**
   * If the router is not yet created, this method creates the router, and
   * mounts the prototype's middleware on it.
   *
   * This method is called by the prototype's handle method, if the router
   * has not been created yet.
   */
  lazyrouter(): void {
    if (!this.router) {
      this.router = new Router({});
      this.router.use(middleware.init(this));
    }
  },

};