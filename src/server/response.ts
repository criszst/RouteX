'use strict';

import fs, { ReadStream, promises as fsPromises } from 'fs'
import mime from 'mime';

import { basename, join } from 'path';

import ErrorsDetails from "../errors/details";
import Options from "../interfaces/IOptions";

import ExtendedServerResponse from "../interfaces/server/IServerResponse";
import { IPMiddleware } from '../middleware/ip';
import { IncomingMessage, ServerResponse } from 'http';

export class Response {

  constructor(initializer?: (res: ExtendedServerResponse) => void) {
    this.initializer = initializer || this.initializer;
  }

  initializer(res: ExtendedServerResponse): void {
    Response.send(res);
    Response.json(res);
    Response.download(res);
    Response.redirect(res);
    Response.sendFile(res);
  }

  public static send(res: ExtendedServerResponse): void {
    res.send = function (body: object | string) {
      if (typeof body === 'object') {
        this.setHeader('Access-Control-Allow-Methods', 'POST');
        this.setHeader('Content-Type', 'application/json');
        this.end(JSON.stringify(body), 'utf-8');
      } else {
        this.setHeader('Content-Type', 'text/plain');
        this.end(body, 'utf-8');
      }
    };
  }

  public static json(res: ExtendedServerResponse): void {
    res.json = function (body: Object | String) {
      this.setHeader('Access-Control-Allow-Methods', 'POST, GET');
      this.setHeader('Access-Control-Allow-Origin', '*');


      this.setHeader('Content-Type', 'application/json');

      if (!body) return ErrorsDetails.create(
        'Body Error',
        'body is required', {
        received: body,
        expected: typeof body,
      });

      return this.send(body);
    };
  }



  public static download(res: ExtendedServerResponse): void {
    res.download = function (path: string) {
      if (!path) throw ErrorsDetails.create('Path Error', 'path is required', {
        expected: 'non-empty string',
        received: `${typeof path} / ${path}`,
      });

      Response.handleFileRequest(path, this.req, this, (err?: Error) => {
        if (err) {
          this.statusCode = 404;
          this.setHeader('Content-Type', 'application/json');
          return this.end(JSON.stringify({ error: err.message }), 'utf-8');
        }

      });
    };
  }


  /**
   * Adds a redirect method to the response object that performs a 302 redirect.
   *
   * @param res - The response object to which the redirect method is added.
   * 
  */
  public static redirect(res: ExtendedServerResponse): void {
    res.redirect = function (url: string): void {
      if (!url) {
        throw ErrorsDetails.create(
          'URL Error',
          'URL is required', {
          expected: 'non-empty string',
          received: url,
        })
      }

      this.statusCode = 302;
      this.setHeader('Access-Control-Allow-Methods', 'POST, GET');
      this.setHeader('Access-Control-Allow-Origin', '*');
      this.setHeader('Location', url);
      this.end();
    };
  }



  /**
   * Adds a sendFile method to the response object that sends a file to the client.
   * The method takes a path to the file and an options object that can be used to
   * specify additional settings for sending the file.
   *
   * @param res - The response object to which the sendFile method is added.
   *
   * @returns A promise that resolves when the file is sent or an error occurs.
   *
   * @example
   * res.sendFile('path/to/file.txt', {
   *   root: '/path/to/root',
   *   attachment: true,
   *   headers: {
   *     'X-Custom-Header': 'value',
   *   },
   *   maxAge: 1000
   * });
   */
  public static sendFile(res: ExtendedServerResponse): Promise<void> | void {
    res.sendFile = function (path: string, options?: Options, callback?: (err?: Error | null) => void): Promise<void> {

      return new Promise(async (resolve, rejects) => {
        try {
          const filePath = options?.root ? join(options.root, path) : path

          if (!path)
            throw ErrorsDetails.create(
              'Path Error',
              'Path is required', {
              expected: 'non-empty string',
              received: path,
            });

          if (!fs.existsSync(filePath))
            throw ErrorsDetails.create(
              'Path Error',
              'This path does not exist', {
              expected: 'a valid path',
              received: filePath,
            });

          if (callback && typeof callback !== 'function') {
            throw ErrorsDetails.create(
              'Callback Error',
              'Callback must be a function', {
              expected: 'function',
              received: typeof callback,
            })
          }

          if (!this || !(this instanceof ServerResponse)) {
            throw ErrorsDetails.create(
              'Response Error',
              'sendFile must be called on an instance of ServerResponse or ExtendedServerResponse', {
              expected: 'ServerResponse or ExtendedServerResponse instance',
              received: this,
            });
          }


          const contentType: string = mime.getType(filePath) || 'application/octet-stream';
          const stats: fs.Stats = fs.statSync(filePath)


          this.setHeader('Access-Control-Allow-Methods', 'POST');
          this.setHeader('Content-Type', contentType)
          this.setHeader('Content-Disposition', `${options?.attachment ? 'attachment' : 'inline'}; filename=${basename(filePath)}`);
          this.setHeader('Content-Length', stats.size);

          if (options?.maxAge !== undefined) {
            this.setHeader('Cache-Control', `public, max-age=${options.maxAge}`)
          }

          if (options?.headers) {
            for (const [key, value] of Object.entries(options.headers)) {
              this.setHeader(key, value)
            }
          }

          if (stats.size < 1024 * 1024) {
            const data: Buffer = await fsPromises.readFile(filePath);

            this.write(data);
            this.end();

            callback?.(null)
            return resolve()
          }

          const stream: ReadStream = fs.createReadStream(filePath);

          stream.pipe(this);

          stream.on('end', () => {
            callback?.(null);
            resolve();
          });


          stream.on('error', (err) =>
            callback?.call(this, err));

        } catch (err: any) {
          callback?.call(this, err)
          rejects(err)
        }
      })
    };
  }


  // TODO: implement handleFileRequest as a middleware
  /**
   * Handles a file request.
   *
   * @param path - The path to the requested file.
   * @param req - The incoming HTTP request.
   * @param res - The HTTP response object to be sent back to the client.
   * @param next - A callback function to pass control to the next middleware.
   *
   * @returns A promise that resolves when the file is sent or an error occurs.
   *
   * @throws An error with a status code of 404 if the requested file does not exist.
   * @throws An error with a status code of 500 if an error occurs while reading the file.
   */
  private static async handleFileRequest(path: string, req: IncomingMessage, res: ServerResponse, next: (err?: Error) => void): Promise<void> {
    try {
      const filePath = join(__dirname, path);

      if (!fs.existsSync(filePath)) {
        return next(
          ErrorsDetails.create('File Not Found', 'The requested file does not exist',
            { expected: 'a valid path', received: filePath },
          )
        );
      }

      const stats = fs.statSync(filePath);

      res.setHeader('Content-Length', stats.size);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

      if (stats.size < 1024 * 1024) {

        res.setHeader('Content-Disposition', `attachment; filename=${basename(filePath)}`);
        res.setHeader('Content-Type', mime.getType(filePath) || 'application/octet-stream');
        res.write('file downloaded successfully');
        res.end();
      }
      else {
        const stream = fs.createReadStream(filePath);

        res.setHeader('Content-Disposition', `attachment; filename=${basename(filePath)}`);
        res.setHeader('Content-Type', mime.getType(filePath) || 'application/octet-stream');
        res.write('file downloaded successfully');

        stream.pipe(res);
        stream.on('end', () => res.end());
        stream.on('error', (err) => res.end(`Error: ${err.message}`));
      }
    } catch (error: any) {
      next(error);
    }
  }

}
export default Response;