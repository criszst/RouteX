import App from "../core/types/IApp"

import { prototype } from "../http/middleware/prototype"
import { merge } from "../utils/merge"

import { IncomingMessage, ServerResponse } from "http"


import IServerResponse from "../http/response/IServerResponse"
import IServerRequest from "../http/request/IServerRequest"

function createApp(): App {
  const app = ((req: IServerRequest, res: IServerResponse): void => {
    app.handle(req, res)
  }) as App

  const appReference = (obj: object): object => {
    return Object.create(obj, {
      app: {
        value: app,

        configurable: true,
        writable: true,
        enumerable: false,
      },
      req: {
        value: app.request,

        configurable: true,
        writable: true,
        enumerable: false,
      },
      res: {
        value: app.response,

        configurable: true,
        writable: true,
        enumerable: false,
      },
    });
  };

  merge(app, prototype, false)

  const req = Object.create(IncomingMessage.prototype)
  const res = Object.create(ServerResponse.prototype)

  app.request = Object.create(req as IServerRequest, appReference.prototype);
  app.response = Object.create(res as IServerResponse, appReference.prototype);

  // TODO: Implement showLogs method
  // app.showLogs = (options: {tiny?: boolean, big?: boolean, custom?: boolean}) => {
  //   app._router.showLogs(options)
  // }

  app.setCustom404 = (handler: any) => {
    app.lazyrouter();
    app.router.setCustom404(handler);
  };

  app.use = (pathOrHandler: any, ...handlers: Function[]): void => {
    app.lazyrouter();

    if (typeof pathOrHandler === 'function') {
      app.router.use(pathOrHandler);
      return;
    }

    app.router.use(pathOrHandler, handlers);
  };

  return app;
}

export const app = createApp()
