export class CompiledNode {
  children = new Map<string, CompiledNode>();

  paramChild?: CompiledNode;
  paramName?: string;

  handlers = new Map<string, Function[]>();
}
