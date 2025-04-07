import {IncomingMessage, ServerResponse} from "http";

import Options from "./IOptions";

export default interface ExtendedServerResponse extends ServerResponse {
  send: (body: object | string) => void;
  json: (body: object | string) => void;
  download: (path: string) => void;
  redirect: (url: string) => void;
  sendFile: (
    path: string,
    options?: Options,
    callback?: (err?: Error | null) => void
  ) => Promise<void>;
}