import App from "./interfaces/IApp"

import { prototype } from "./middleware/prototype"
import { merge } from "./libs/merge"

import { IncomingMessage, ServerResponse } from "http"
import { Response } from "./server/response"


import IServerResponse from "./interfaces/server/IServerResponse"
import IServerRequest from "./interfaces/server/IServerRequest"
import Router from "./router"

function createApp(): App {
  const app = ((alias: string, req: IServerRequest, res: IServerResponse, next: any): void => {
    app.handle(alias, req, res, next)
  }) as unknown as App

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

  app.setCustom404 = (handler) => {
    app.lazyrouter();
    app.router.setCustom404(handler);
  };


  app.init()

  return app
}

export const app = createApp()
