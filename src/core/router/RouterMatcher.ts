import { CompiledNode } from "./CompiledNode";

// Matcher all routes
export class RouterMatcher {
  constructor(private root: CompiledNode) {}

  match(method: string, path: string) {
    const cleanPath = path.split('?')[0];
    const segments = cleanPath.split("/").filter(Boolean)

    let node = this.root

    const params: Record<string, string> = {}

    if (segments.length === 0) {
      const handler = node.handlers.get(method.toUpperCase()) || node.handlers.get("ANY")

      if (!handler) return null

      return handler ? { handler, params } : null
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

    return { handler, params };

  }
}
