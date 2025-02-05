import { Router } from "./router"
import App from "./interfaces/IApp"

const middleware = require("./middleware/init")

const http = require("http")
const mixin = require("merge-descriptors")

const proto = {
  router: {} as Router,
  _router: null as Router | null,
  init() {
    this.router = new Router()
  },

  lazyrouter() {
    if (!this.router) {
      this.router = new Router({});
      this.router.use(middleware.init(this));
    }
  },

  handle(req: any, res: any, next: any) {
    this.lazyrouter()

    if (!res.send) {
      res.send = function (body: any) {
          if (typeof body === 'object') {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(body), 'utf-8');
          } else {
              res.setHeader('Content-Type', 'text/plain');
              res.end(body, 'utf-8');
          }
      };
  }

  if (!res.json) {
      res.json = function (body: any) {
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(body));
      };
  }
    this.router.handle(req, res, next)
  },

  listen(port: number, callback: () => void) {
    const server = http.createServer(this)
    return server.listen(port, callback)
  },

  get(path: string, ...handlers: Array<(req: any, res: any, next?: any) => void>) {
    this.lazyrouter()
    this.router.get(path, ...handlers)
  },

  post(path: string, ...handlers: Array<(req: any, res: any, next?: any) => void>) {
    this.lazyrouter()
    this.router.post(path, ...handlers)
  }
}

function createApp(): App {
  const app = ((req: any, res: any, next: any) => {
    app.handle(req, res, next)
  }) as unknown as App

  mixin(app, proto, false)

  const req = Object.create(http.IncomingMessage.prototype)


  const res = Object.create(http.ServerResponse.prototype)

  app.response = Object.create(http.ServerResponse.prototype);

  app.response.send = function (body: any) {
    if (typeof body === 'object') {
      this.setHeader('Content-Type', 'application/json');
      this.end(JSON.stringify(body), 'utf-8');
    } else {
      this.setHeader('Content-Type', 'text/plain');
      this.end(body, 'utf-8');
    }
  };

  app.response.json = function (body: any) {
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