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


  /**
   * Returns the HTTP method of the request. If the request method is not specified,
   * the value of the "X-HTTP-Method-Override" header is returned if present.
   * @returns The HTTP method of the request as a string.
   */
  public get method(): IncomingMessage["method"] {
    const override = this.req.headers["x-http-method-override"];
    
    if (!this.req.method) {
      return "GET";
    }

    if (override && typeof override === "string") {
      return override.toUpperCase();
    }

    return this.req.method;
  }

  /**
   * Returns the URL of the request. If the request URL is not specified,
   * the root URL "/" is returned.
   * @returns The URL of the request as a string.
   */
  public get url(): string {
    return this.req.url || "/";
  }

  /**
   * Returns the headers of the request as an object.
   * @returns The headers of the request as an object.
   */
/*******  e2339da0-f304-4ab1-9bf1-04b099306551  *******/    

  public get headers(): IncomingMessage["headers"] {
    return this.req.headers;
  }
}