import { RouteXMiddleware } from "../../middleware/RouteMiddleware";

export function compilePipeline(handlers: RouteXMiddleware[]) {
  return async function pipeline(req: any, res: any) {
    let index: number = 0

    const next = async () => {
      const fn = handlers[index++]

      if (!fn) return

      await fn(req, res, next)
    }

    await next()
  }
}
