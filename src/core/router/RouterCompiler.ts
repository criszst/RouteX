import { Layer } from "../layer/layer";
import { CompiledNode } from "./CompiledNode";

export class RouteCompiler {
  static compile(stack: Layer[]) {
    const root = new CompiledNode()

    // i've been thinking about all theses complexities... big o cryings now
    for (const layer of stack) {
      for (const alias of layer.aliases) {
        const segments = alias.split("/").filter(Boolean);

        let node = root;

        for (const seg of segments) {
          if (seg.startsWith(":")) {

            if (!node.paramChild) {
              node.paramChild = new CompiledNode();
              node.paramChild.paramName = seg.slice(1)
            }
            node = node.paramChild;

          } else {
            if (!node.children.has(seg)) {
              node.children.set(seg, new CompiledNode())
            }
            node = node.children.get(seg)!
          }
        }


        for (const method of layer.methods) {

          if (!node.handlers.get(method)) {
            node.handlers.set(method, []);
          }

          node.handlers.get(method)!.push(layer.handler);
        }
      }

    }

    return root;
  }
}
