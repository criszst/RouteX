import App from "./interfaces/IApp"

import { proto } from "./middleware/prototype"
import { merge } from "./libs/merge"

import { IncomingMessage, ServerResponse } from "http"

function createApp(): App {
  const app = ((req: IncomingMessage, res: ServerResponse, next: any) => {
    app.handle(req, res, next)
  }) as unknown as App

  merge(app, proto, false)

  const req = Object.create(IncomingMessage.prototype)
  const res = Object.create(ServerResponse.prototype)

  app.request = Object.create(ServerResponse.prototype);
  app.response = Object.create(ServerResponse.prototype);


  app.response.send = function (body: object | string) {
    if (typeof body === 'object') {
      this.setHeader('Content-Type', 'application/json');
      this.end(JSON.stringify(body), 'utf-8');
    } else {
      this.setHeader('Content-Type', 'text/plain');
      this.end(body, 'utf-8');
    }
  };

  app.response.json = function (body: object | string) {
    this.setHeader('Content-Type', 'application/json');
    return this.send(JSON.stringify(body));
  };

  app.request = Object.create(req, {
    app: {
      configurable: true,
      enumerable: true,
      writable: true,
      value: app,
    }
  })

  app.response = Object.create(res, {
    app: {
      configurable: true,
      enumerable: true,
      writable: true,
      value: app,
    }
  })

  app.init()
  return app
}

export const app = createApp()