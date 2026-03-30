import { CompiledNode } from "./CompiledNode";

// Matcher all routes
export class RouterMatcher {
  constructor(private root: CompiledNode) {}

  match(method: string, path: string) {
    const queryIndex = path.indexOf("?")

    const cleanPath = queryIndex !== -1 ? path.slice(0, queryIndex) : path;
    const rawQuery = queryIndex !== -1 ? path.slice(queryIndex + 1) : "";

    const segments = cleanPath.split("/").filter(Boolean)

    const params: Record<string, string> = {}
    const query = RouterMatcher.parseQuery(rawQuery)

    let node = this.root


    if (segments.length === 0) {
      const handler = node.handlers.get(method.toUpperCase()) || node.handlers.get("ANY")

      if (!handler) return null

      return handler ? { handler, params, query } : null
    }

    for (const seg of segments) {
      if (node.children.has(seg)) {
        node = node.children.get(seg)!
      }

      else if (node.paramChild) {
        params[node.paramChild.paramName!] = seg;
        node = node.paramChild;
      }

      else {
        return null
      }
    }

    const handler = node.handlers.get(method.toUpperCase()) || node.handlers.get("ANY")

    if (!handler) return null

    return { handler, params, query };

  }

  private static parseQuery(raw: string): Record<string, string | string[]> {
    if (!raw) return {}

    const result: Record<string, string | string[]> = {};

    const searchParams = new URLSearchParams(raw);

    searchParams.forEach((value, key) => {
      if (result[key]) {
        if (Array.isArray(result[key])) {
          (result[key] as string[]).push(value)
        } else {
          result[key] = [result[key] as string, value]
        }
      } else {
        result[key] = value
      }
    })

    return result
  }
}
