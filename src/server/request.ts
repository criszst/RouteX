import { IncomingMessage, ServerResponse } from "http";

export class Request {
  constructor (
    public req: IncomingMessage,
    public res: ServerResponse
  ) {
    this.init();
  }

  init(): void {
    this.req.socket.setTimeout(0); 
  
  }


  public get method(): IncomingMessage["method"] {
    // for some reason, when we use post method, the req.method return 'get'
    if (!this.req.method) {
      return this.req.headers["x-http-method-override"] as string;
    }

    return this.req.method;
  }

  public get url(): string {
    return this.req.url || "/";
  }

  public get headers(): IncomingMessage["headers"] {
    return this.req.headers;
  }
}