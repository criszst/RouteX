"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
const mime_1 = __importDefault(require("mime"));
const fs_1 = __importDefault(require("fs"));
class Response {
    static send(res) {
        res.send = function (body) {
            if (typeof body === 'object') {
                this.setHeader('Content-Type', 'application/json');
                this.end(JSON.stringify(body), 'utf-8');
            }
            else {
                this.setHeader('Content-Type', 'text/plain');
                this.end(body, 'utf-8');
            }
        };
    }
    static json(res) {
        res.json = function (body) {
            this.setHeader('Content-Type', 'application/json');
            return this.send(JSON.stringify(body));
        };
    }
    // TODO: fs stream is kinda over engineering, so lets check if the path needs that
    // if no, just read the entire file instead process the file in chunks
    static download(res) {
        res.download = function (path) {
            const contentType = mime_1.default.getType(path) || 'application/octet-stream';
            this.setHeader('Content-Type', contentType);
            this.setHeader('Content-Disposition', `attachment; filename=${path.split('/').pop()}`);
            const fileStream = fs_1.default.createReadStream(path);
            fileStream.pipe(this);
        };
    }
    static redirect(res) {
        res.redirect = function (url) {
            if (!url) {
                return;
            }
            this.statusCode = 302;
            this.setHeader('Location', url);
            this.end();
        };
    }
    static sendFile(res) {
        res.sendFile = function (path, options, fn) {
            const contentType = mime_1.default.getType(path) || 'application/octet-stream';
            const fileText = fs_1.default.readFileSync(path);
            this.setHeader('Content-Type', contentType);
            this.write(fileText);
            this.end();
        };
    }
}
exports.Response = Response;
