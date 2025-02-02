import { Router } from "./router"
import App from "./interfaces/IApp"

const mergeDescriptors = require("merge-descriptors")


const prototype = {
  router: {} as Router,

  init() {
    this.router = new Router()
  },
  handle(req: any, res: any, next: any) {
    this.router.handle(req, res, next)
  },
  listen(port: number, callback: () => void) {
    const server = require("http").createServer(this)
    return server.listen(port, callback)
  },
  get(path: string, ...handlers: Array<(req: any, res: any, next?: any) => void>) {
    this.router.get(path, ...handlers)
  },

  post(path: string, ...handlers: Array<(req: any, res: any, next?: any) => void>) {
    this.router.post(path, ...handlers)
  }
}

function createApp(): App {
  const app = ((req: any, res: any, next: any) => {
    app.handle(req, res, next)
  }) as unknown as App

  mergeDescriptors(app, prototype, false)

  app.init()
  return app
}

export const app = createApp()

