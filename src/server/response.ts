import ExtendedServerResponse from "../interfaces/IServerResponse";
import Options from "../interfaces/IOptions";

import ErrorsDetails from "../errors/details";

import mime from 'mime';
import fs, { ReadStream, promises as fsPromises, createReadStream, statSync, existsSync } from 'fs'

import { basename, join } from 'path';
import { rejects } from "assert";

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
      this.setHeader('Content-Type', 'application/json');

      if (!body) return ErrorsDetails.create(
        'Body Error',
        'body is required', {
        received: body,
        expected: 'non-empty object',
      });

      return this.send(JSON.stringify(body));
    };
  }



  public static download(res: ExtendedServerResponse): void {
    res.download = function (path: string) {
      if (!path) throw ErrorsDetails.create(
        'Path Error',
        'path is required', {
        expected: 'non-empty string',
        received: path,
      })


      const contentType = mime.getType(path) || 'application/octet-stream';
      const stats = fs.statSync(path)

      this.setHeader('Content-Type', contentType);
      this.setHeader('Content-Disposition', `attachment; filename=${path.split('/').pop()}`);


      // verifing if the file has a size more than 10mb. If no, just read entire content
      // otherwise, process the file in chunks 
      // i think this could be more efficient, but at the moment im just going to do it like this

      let fileContent: Buffer | ReadStream;

      if (stats.size < 1024 * 1024) fileContent = fs.readFileSync(path);

      else fileContent = fs.createReadStream(path)


      this.write(fileContent);
      this.end();
    };
  }

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
      this.setHeader('Location', url);
      this.end();
    };
  }



  public static sendFile(res: ExtendedServerResponse): Promise<void> | void {
    res.sendFile = function (path: string, options?: Options, callback?: (err?: Error | null) => void): Promise<void> {
      
      // wth i making this
      return new Promise(async (resolve, reject) => {
        try {
          const filePath = options?.root ? join(options.root, path) : path

          if (!path)
            throw ErrorsDetails.create(
              'Path Error',
              'Path is required', {
              expected: 'non-empty string',
              received: path,
            });

          if (!fs.existsSync(path))
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
              expected: 'non-empty object',
              received: typeof callback,
            })
          }


          const contentType: string = mime.getType(filePath) || 'application/octet-stream';
          const stats: fs.Stats = fs.statSync(filePath)


          this.setHeader('Content-Type', contentType)
          this.setHeader('Content-Disposition', `${options?.attachment ? 'attachment' : 'inline'}; filename=${basename(filePath)}`);

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
}