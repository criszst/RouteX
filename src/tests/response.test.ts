import { describe, expect, it, jest } from '@jest/globals';
import { Response } from '../http/response/response';
import ExtendedServerResponse from '../http/response/IServerResponse';
import path from 'path';
import fs from 'fs';
import createMockResponse from '../__mocks__/response.mock';

const mime = require('mime');

describe('Response', () => {

  it('send() should stringify objects and set JSON header', () => {
    const res = createMockResponse();

    Response.send(res);
    res.send({ a: 1 });

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.end).toHaveBeenCalled();
  });

  it('json() should set header and call send()', () => {
    const res = createMockResponse();

    Response.send(res);
    Response.json(res);

    res.json({ a: 1 });

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');

    expect(res.send).toHaveBeenCalledWith(JSON.stringify({ a: 1 }));
  });

  it('download() should set headers and stream file', () => {
    const res = createMockResponse();

    jest.spyOn(mime, 'getType').mockReturnValue('text/plain');
    jest.spyOn(fs, 'createReadStream').mockReturnValue({
      pipe: jest.fn()
    } as any);


    Response.download(res);
    res.download('/file.txt');

    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/json'
    );

    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      'attachment; filename=file.txt'
    );
  });

  it('redirect() should set location header and end response', () => {
    const res = createMockResponse();

    Response.redirect(res);
    res.redirect('https://example.com');

    expect(res.setHeader).toHaveBeenCalledWith('Location', 'https://example.com');
    expect(res.end).toHaveBeenCalled();
  });

});
