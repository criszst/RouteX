import { ServerResponse } from "http";

import Options from "../../core/types/IOptionsFile";

export default interface IServerResponse extends ServerResponse {
  /**
   * Sends a response.
   * @param body The body to send.
   *
   * @example response.send({ message: "Hello World!" })
   */
  send: (body: object | string) => void;

  /**
   * Sends a JSON response.
   * @param body The JSON body to send. Prefer to send a JSON Object.
   *
   * @example response.json({ message: "Hello World!" })
   */
  json: (body: object | string) => void;

  /**
   * Downloads a file to the client.
   *
   * @param path The path to the file.
   */
  download: (path: string) => void;


  /**
   * Redirects the client to the specified URL.
   *
   * @param url The URL to redirect to.
   */
  redirect: (url: string) => void;

  /**
   * Sends a file to the client.
   *
   * @param path The path to the file.
   * @param options The options for sending the file.
   * @param callback The callback function to call when the file is sent.
   */
  sendFile: (
    path: string,
    options?: Options,
    callback?: (err?: Error | null) => void
  ) => Promise<void>;

}
