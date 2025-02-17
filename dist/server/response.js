"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
const details_1 = __importDefault(require("../errors/details"));
const mime_1 = __importDefault(require("mime"));
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
class Response {
    constructor(initializer) { }
    initialize(res) {
        Response.send(res);
        Response.json(res);
        Response.download(res);
        Response.redirect(res);
        Response.sendFile(res);
    }
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
    // yea i know this is not the same function on express, but i wanna make a something different
    // TODO: change the response of sendFile function
    static sendFile(res) {
        res.sendFile = function (path, options, callback) {
            if (!path)
                throw details_1.default.create('Path is required', {
                    expected: 'non-empty string',
                    received: path,
                });
            if (!fs_1.default.existsSync(path))
                throw details_1.default.create('This path does not exist', {
                    expected: 'a valid path',
                    received: path,
                });
            const contentType = mime_1.default.getType(path) || 'application/octet-stream';
            const stats = fs_1.default.statSync(path);
            let fileContent;
            if (stats.size < 1024 * 1024)
                fileContent = fs_1.default.readFileSync(path);
            else
                fileContent = fs_1.default.createReadStream(path);
            this.setHeader('Content-Type', contentType);
            this.setHeader('Content-Disposition', `${(options === null || options === void 0 ? void 0 : options.attachment) ? 'attachment' : 'inline'}; filename=${(0, path_1.basename)(path)}`);
            if (callback) {
                callback.call(this, JSON.stringify(fileContent));
            }
            else {
                this.write(fileContent);
                this.end();
            }
        };
    }
}
exports.Response = Response;
