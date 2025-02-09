import App from "./interfaces/IApp"

import { prototype } from "./middleware/prototype"
import { merge } from "./libs/merge"

import { IncomingMessage, ServerResponse } from "http"

function createApp(): App {
  const app = ((req: IncomingMessage, res: ServerResponse, next: any) => {
    app.handle(req, res, next)
  }) as unknown as App

  const appReference = (obj: object) => {
    return Object.create(obj, {
      app: {
        configurable: true,
        enumerable: true,
        writable: true,
        value: app,
      },
    });
  };

  merge(app, prototype, false)

  const req = Object.create(IncomingMessage.prototype)
  const res = Object.create(ServerResponse.prototype)

  app.request = Object.create(req, appReference.prototype);
  app.response = Object.create(res, appReference.prototype);

  app.init()

  return app
}

export const app = createApp()