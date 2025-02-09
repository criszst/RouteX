import ExtendedServerResponse from "../interfaces/IServerResponse";

import mime from 'mime';

export class Response {

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
            return this.send(JSON.stringify(body));
        };
    }

    public static download(res: ExtendedServerResponse): void {
        res.download = function (path: string) {
            const fs = require('fs');
            const contentType = mime.getType(path) || 'application/octet-stream';


            this.setHeader('Content-Type', contentType);
            this.setHeader('Content-Disposition', `attachment; filename=${path.split('/').pop()}`);

            const fileStream = fs.createReadStream(path);
            fileStream.pipe(this);
        };
    }
}