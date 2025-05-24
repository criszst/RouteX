"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
const fs_1 = __importStar(require("fs"));
const mime_1 = __importDefault(require("mime"));
const path_1 = require("path");
const details_1 = __importDefault(require("../errors/details"));
class Response {
    constructor(initializer) {
        this.initializer = initializer || this.initializer;
    }
    initializer(res) {
        Response.send(res);
        Response.json(res);
        Response.download(res);
        Response.redirect(res);
        Response.sendFile(res);
    }
    static send(res) {
        res.send = function (body) {
            if (typeof body === 'object') {
                this.setHeader('Access-Control-Allow-Method', 'POST');
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
            this.setHeader('Access-Control-Allow-Method', 'POST, GET');
            this.setHeader('Access-Control-Allow-Origin', '*');
            this.setHeader('Content-Type', 'application/json');
            if (!body)
                return details_1.default.create('Body Error', 'body is required', {
                    received: body,
                    expected: 'non-empty object',
                });
            return this.send(JSON.stringify(body));
        };
    }
    static download(res) {
        res.download = function (path) {
            if (!path)
                throw details_1.default.create('Path Error', 'path is required', {
                    expected: 'non-empty string',
                    received: path,
                });
            const contentType = mime_1.default.getType(path) || 'application/octet-stream';
            const stats = fs_1.default.statSync(path);
            this.setHeader('Access-Control-Allow-Method', 'POST');
            this.setHeader('Access-Control-Allow-Origin', '*');
            this.setHeader('Content-Type', contentType);
            this.setHeader('Content-Disposition', `attachment; filename=${path.split('/').pop()}`);
            // verifing if the file has a size more than 10mb. If no, just read entire content
            // otherwise, process the file in chunks 
            // i think this could be more efficient, but at the moment im just going to do it like this
            let fileContent;
            if (stats.size < 1024 * 1024)
                fileContent = fs_1.default.readFileSync(path);
            else
                fileContent = fs_1.default.createReadStream(path);
            this.write(fileContent);
            this.end();
        };
    }
    /**
     * Adds a redirect method to the response object that performs a 302 redirect.
     *
     * @param res - The response object to which the redirect method is added.
     *
    */
    static redirect(res) {
        res.redirect = function (url) {
            if (!url) {
                throw details_1.default.create('URL Error', 'URL is required', {
                    expected: 'non-empty string',
                    received: url,
                });
            }
            this.statusCode = 302;
            this.setHeader('Access-Control-Allow-Method', 'POST, GET');
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
    static sendFile(res) {
        res.sendFile = function (path, options, callback) {
            return new Promise((resolve, rejects) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const filePath = (options === null || options === void 0 ? void 0 : options.root) ? (0, path_1.join)(options.root, path) : path;
                    if (!path)
                        throw details_1.default.create('Path Error', 'Path is required', {
                            expected: 'non-empty string',
                            received: path,
                        });
                    if (!fs_1.default.existsSync(path))
                        throw details_1.default.create('Path Error', 'This path does not exist', {
                            expected: 'a valid path',
                            received: filePath,
                        });
                    if (callback && typeof callback !== 'function') {
                        throw details_1.default.create('Callback Error', 'Callback must be a function', {
                            expected: 'non-empty object',
                            received: typeof callback,
                        });
                    }
                    const contentType = mime_1.default.getType(filePath) || 'application/octet-stream';
                    const stats = fs_1.default.statSync(filePath);
                    this.setHeader('Access-Control-Allow-Method', 'POST');
                    this.setHeader('Content-Type', contentType);
                    this.setHeader('Content-Disposition', `${(options === null || options === void 0 ? void 0 : options.attachment) ? 'attachment' : 'inline'}; filename=${(0, path_1.basename)(filePath)}`);
                    if ((options === null || options === void 0 ? void 0 : options.maxAge) !== undefined) {
                        this.setHeader('Cache-Control', `public, max-age=${options.maxAge}`);
                    }
                    if (options === null || options === void 0 ? void 0 : options.headers) {
                        for (const [key, value] of Object.entries(options.headers)) {
                            this.setHeader(key, value);
                        }
                    }
                    if (stats.size < 1024 * 1024) {
                        const data = yield fs_1.promises.readFile(filePath);
                        this.write(data);
                        this.end();
                        callback === null || callback === void 0 ? void 0 : callback(null);
                        return resolve();
                    }
                    const stream = fs_1.default.createReadStream(filePath);
                    stream.pipe(this);
                    stream.on('end', () => {
                        callback === null || callback === void 0 ? void 0 : callback(null);
                        resolve();
                    });
                    stream.on('error', (err) => callback === null || callback === void 0 ? void 0 : callback.call(this, err));
                }
                catch (err) {
                    callback === null || callback === void 0 ? void 0 : callback.call(this, err);
                    rejects(err);
                }
            }));
        };
    }
}
exports.Response = Response;
