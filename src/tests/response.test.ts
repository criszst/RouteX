import {describe, expect, it} from '@jest/globals';
import mime from 'mime';

import { Response } from "../server/response";
import ExtendedServerResponse from "../interfaces/IServerResponse";

const fs = require('fs');

describe('Response', () => {

    it('should set JSON content type and send JSON string for object input in send method', (): void => {
        const res = {
            setHeader: jest.fn(),
            end: jest.fn(),
        } as unknown as ExtendedServerResponse;

        Response.send(res);
        const body = { key: 'value' };
        res.send(body);

        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.end).toHaveBeenCalledWith(JSON.stringify(body), 'utf-8');
    });


    it('should set plain text content type and send string for string input in send method', (): void => {
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


    it('should set JSON content type and send JSON string in json method', (): void => {
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


    it('should set appropriate headers and stream file in download method', (): void => {
        const res = {
            setHeader: jest.fn(),
            pipe: jest.fn()
        } as unknown as ExtendedServerResponse;


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


    it('should redirect properly to a new url', (): void => {
        const res = {
            setHeader: jest.fn(),
            redirect: jest.fn(),
            end: jest.fn()
        } as unknown as ExtendedServerResponse;

        const url = 'https://example.com';

        Response.redirect(res);
        res.redirect(url);

        expect(res.setHeader).toHaveBeenCalledWith('Location', url);
        expect(res.end).toHaveBeenCalled();
    })


    it('should send file to client', (): void => {
        const res = {
          setHeader: jest.fn(),
          sendfile: jest.fn()
        } as unknown as ExtendedServerResponse;

        Response.sendFile(res);

        res.sendFile('./download.test.txt', {
          attachment: true,
          root: undefined
        }, (err: Error) => {
          if (err) {
            console.error(err.stack);
          }
        })

        expect(res.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=download.test.txt');
        expect(fs.createReadStream).toHaveBeenCalledWith('/path/to/file.txt');
      }) 
});