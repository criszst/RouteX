"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
const mime_1 = __importDefault(require("mime"));
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
    static download(res) {
        res.download = function (path) {
            const fs = require('fs');
            const contentType = mime_1.default.getType(path) || 'application/octet-stream';
            this.setHeader('Content-Type', contentType);
            this.setHeader('Content-Disposition', `attachment; filename=${path.split('/').pop()}`);
            const fileStream = fs.createReadStream(path);
            fileStream.pipe(this);
        };
    }
}
exports.Response = Response;
