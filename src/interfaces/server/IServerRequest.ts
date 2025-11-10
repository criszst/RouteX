import { IncomingMessage, IncomingHttpHeaders } from "http";

export default interface IServerRequest extends IncomingMessage {
  /**
   * Returns the HTTP method of the request. If the request method is not specified,
   * the value of the "X-HTTP-Method-Override" header is returned if present.
   * @returns The HTTP method of the request as a string.
   *
   */
  method: string; // HTTP method (GET, POST, etc.)

  /**
   * Returns the URL of the request. If the request URL is not specified,
   * the root URL "/" is returned.
   * @returns The URL of the request as a string.
   */
  url: string;


  /**
   * Returns the headers of the request as an object.
   * @returns The headers of the request as an object.
   */
  headers: IncomingHttpHeaders;

  /**
   * Optional request body, can be used for POST/PUT requests
   *
   */
  body?: any;

  /**
   * Returns the cookies of the request as an object.
   * @returns  key: string - returns an object with key-value pairs of cookies
   */
  cookies?: { [key: string]: string };
}
