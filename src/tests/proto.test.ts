import { describe, expect, it, beforeEach } from '@jest/globals';
import { IncomingMessage } from 'http';
import { prototype } from '../middleware/prototype';
import Router from '../router';

const proto = prototype;

describe('proto', () => {
  beforeEach(() => {
    // Ensure proto.router is properly initialized
    proto.router = {
      handle: jest.fn(),
    } as unknown as Router;
  });

  it('should have an init method', () => {
    expect(proto.init).toBeInstanceOf(Function);
  });

  // --- test the set method
  it('should set the etag fn setting', () => {
    proto.set('etag', 'value etag');
    expect(proto.settings['etag']).toBe('value etag');
  });

  it('should set the query parser fn setting', () => {
    proto.set('query parser', 'value parser ');
    expect(proto.settings['query parser']).toBe('value parser ');
  });

  it('should set the trust proxy fn setting', () => {
    proto.set('trust proxy', 'value proxy');
    expect(proto.settings['trust proxy']).toBe('value proxy');
  });

  // --- test the enabled method
  it('should enable the etag fn setting', () => {
    expect(proto.enabled('etag')).toBe(true);
  });

  it('should enable the query parser fn setting', () => {
    expect(proto.enabled('query parser')).toBe(true);
  });

  it('should enable the trust proxy fn setting', () => {
    expect(proto.enabled('trust proxy')).toBe(true);
  });

  // --- test the handle method
  // it('should call response methods', () => {
  //   const res = jest.mock({
  //     send: jest.fn(),
  //     json: jest.fn(),
  //     download: jest.fn(),
  //   });
  //   const req = IncomingMessage.prototype;
  //   const next = jest.fn();

  //   jest.spyOn(proto.router, 'handle').mockImplementation(() => { });
  //   proto.handle(req, res, next);

  //   expect(res.send).toHaveBeenCalledTimes(1);
  //   expect(res.json).toHaveBeenCalledTimes(1);
  //   expect(res.download).toHaveBeenCalledTimes(1);
  //   expect(proto.router.handle).toHaveBeenCalledTimes(1);
  // });
});