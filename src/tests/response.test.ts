import {describe, expect, it} from '@jest/globals';
import mime from 'mime';

import { Response } from "../server/response";
import ExtendedServerResponse from "../interfaces/IServerResponse";


describe('Response', () => {
    it('should set JSON content type and send JSON string for object input in send method', () => {
        const res = {
            setHeader: jest.fn(),
            end: jest.fn()
        } as unknown as ExtendedServerResponse;

        Response.send(res);
        const body = { key: 'value' };
        res.send(body);

        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.end).toHaveBeenCalledWith(JSON.stringify(body), 'utf-8');
    });

    it('should set plain text content type and send string for string input in send method', () => {
        const res = {
            setHeader: jest.fn(),
            end: jest.fn()
        } as unknown as ExtendedServerResponse;

        Response.send(res);
        const body = 'plain text';
        res.send(body);

        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
        expect(res.end).toHaveBeenCalledWith(body, 'utf-8');
    });

    it('should set JSON content type and send JSON string in json method', () => {
        const res = {
            setHeader: jest.fn(),
            send: jest.fn()
        } as unknown as ExtendedServerResponse;

        Response.json(res);
        const body = { key: 'value' };
        res.json(body);

        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.send).toHaveBeenCalledWith(JSON.stringify(body));
    });

    it('should set appropriate headers and stream file in download method', () => {
        const res = {
            setHeader: jest.fn(),
            pipe: jest.fn()
        } as unknown as ExtendedServerResponse;

        const fs = require('fs');
        jest.spyOn(fs, 'createReadStream').mockReturnValue({
            pipe: jest.fn()
        });

        jest.spyOn(mime, 'getType').mockReturnValue('text/plain');

        Response.download(res);
        const path = '/path/to/file.txt';
        res.download(path);

        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
        expect(res.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=file.txt');
        expect(fs.createReadStream).toHaveBeenCalledWith(path);
    });
});