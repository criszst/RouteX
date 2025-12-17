import { RouteHandler } from "../types/IRouteHandler";


export class Layer {
  path: string
  aliases: string[]
  methods: Set<string>
  handler: RouteHandler;
  type: 'route' | 'middleware'

  constructor(opts: {
    path: string
    aliases?: string[]
    methods?: string[]
    handler: RouteHandler
    type: 'route' | 'middleware'
  }) {
    this.path = opts.path
    this.aliases = opts.aliases ?? [opts.path]
    this.methods = new Set(opts.methods ?? ['GET'])
    this.handler = opts.handler
    this.type = opts.type
  }
}
