import { Router } from "./router"
const mergeDescriptors = require("merge-descriptors")

interface App {
  (req: any, res: any, next: any): void
  init(): void
  handle(req: any, res: any, next: any): void
  listen(port: number, callback: () => void): void
  get(path: string, ...handlers: Array<(req: any, res: any, next?: any) => void>): void
  router: Router
}

const proto = {
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
}

function createApp(): App {
  const app = ((req: any, res: any, next: any) => {
    app.handle(req, res, next)
  }) as unknown as App

  mergeDescriptors(app, proto, false)

  app.init()
  return app
}

export const app = createApp()

