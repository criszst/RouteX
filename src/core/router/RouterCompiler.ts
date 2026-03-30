import { Layer } from "../layer/layer";
import { CompiledNode } from "./CompiledNode";

export class RouteCompiler {
  static compile(stack: Layer[]) {
    const root = new CompiledNode()


    for (const layer of stack) {
      for (const alias of layer.aliases) {
        const segments = alias.split("/").filter(segments => segments);

        let currentNode = root;

        for (const seg of segments) {
          if (seg.startsWith(":")) {

            if (!currentNode.paramChild) {
              currentNode.paramChild = new CompiledNode();
              currentNode.paramChild.paramName = seg.slice(1)
            }
            currentNode = currentNode.paramChild;

          } else {
            if (!currentNode.children.has(seg)) {
              currentNode.children.set(seg, new CompiledNode())
            }
            currentNode = currentNode.children.get(seg)!
          }
        }


        for (const method of layer.methods) {

          if (!currentNode.handlers.get(method)) {
            currentNode.handlers.set(method, []);
          }

          currentNode.handlers.get(method)!.push(layer.handler);
        }
      }

    }

    return root;
  }
}
