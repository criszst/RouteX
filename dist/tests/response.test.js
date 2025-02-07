"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const mime_1 = __importDefault(require("mime"));
const response_1 = require("../server/response");
(0, globals_1.describe)('Response', () => {
    (0, globals_1.it)('should set JSON content type and send JSON string for object input in send method', () => {
        const res = {
            setHeader: jest.fn(),
            end: jest.fn()
        };
        response_1.Response.send(res);
        const body = { key: 'value' };
        res.send(body);
        (0, globals_1.expect)(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        (0, globals_1.expect)(res.end).toHaveBeenCalledWith(JSON.stringify(body), 'utf-8');
    });
    (0, globals_1.it)('should set plain text content type and send string for string input in send method', () => {
        const res = {
            setHeader: jest.fn(),
            end: jest.fn()
        };
        response_1.Response.send(res);
        const body = 'plain text';
        res.send(body);
        (0, globals_1.expect)(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
        (0, globals_1.expect)(res.end).toHaveBeenCalledWith(body, 'utf-8');
    });
    (0, globals_1.it)('should set JSON content type and send JSON string in json method', () => {
        const res = {
            setHeader: jest.fn(),
            send: jest.fn()
        };
        response_1.Response.json(res);
        const body = { key: 'value' };
        res.json(body);
        (0, globals_1.expect)(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        (0, globals_1.expect)(res.send).toHaveBeenCalledWith(JSON.stringify(body));
    });
    (0, globals_1.it)('should set appropriate headers and stream file in download method', () => {
        const res = {
            setHeader: jest.fn(),
            pipe: jest.fn()
        };
        const fs = require('fs');
        jest.spyOn(fs, 'createReadStream').mockReturnValue({
            pipe: jest.fn()
        });
        jest.spyOn(mime_1.default, 'getType').mockReturnValue('text/plain');
        response_1.Response.download(res);
        const path = '/path/to/file.txt';
        res.download(path);
        (0, globals_1.expect)(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
        (0, globals_1.expect)(res.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=file.txt');
        (0, globals_1.expect)(fs.createReadStream).toHaveBeenCalledWith(path);
    });
});
