import { Router } from "./router"
import App from "./interfaces/IApp"

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
      this.router = new Router()
    }
  },

  handle(req: any, res: any, next: any) {
    this.lazyrouter()

    if (!res.send) {
      res.send = (body: any) => {
        console.log(`res.send: ${body}`);
      }
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

  res.send = function (body: any) {
    console.log(`res.send: ${body}`);
  }

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