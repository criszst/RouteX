import App from "./interfaces/IApp"

import { prototype } from "./middleware/prototype"
import { merge } from "./libs/merge"

import { IncomingMessage, ServerResponse } from "http"
import { Response } from "./server/response"
import ExtendedServerResponse from "./interfaces/IServerResponse"

function createApp(): App {
  const app = ((alias: string, req: IncomingMessage, res: ServerResponse, next: any): void => {
    app.handle(alias, req, res, next)
  }) as unknown as App

  const appReference = (obj: object): object => {
    return Object.create(obj, {
      app: {
        configurable: true,
        enumerable: true,
        writable: true,
        value: app,
      },
      req: {
        configurable: true,
        enumerable: true,
        writable: true,
        value: app.request,
      },
      res: {
        configurable: true,
        enumerable: true,
        writable: true,
        value: app.response,
      },
    });
  };

  merge(app, prototype, false)

  const req = Object.create(IncomingMessage.prototype)
  const res = Object.create(ServerResponse.prototype)

  app.request = Object.create(req, appReference.prototype);
  app.response = Object.create(res, appReference.prototype);
  new Response().initializer(app.response as ExtendedServerResponse);


  app.init()

  return app
}

export const app = createApp()