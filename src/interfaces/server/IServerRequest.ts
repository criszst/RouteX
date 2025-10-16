import { IncomingMessage, IncomingHttpHeaders } from "http";

export default interface IServerRequest extends IncomingMessage {
  method: string; // HTTP method (GET, POST, etc.)
  url: string;
  headers: IncomingHttpHeaders; 
  body?: any; // Optional request body, can be used for POST/PUT requests
  cookies?: { [key: string]: string }; // Optional cookies parsed from the request headers
}