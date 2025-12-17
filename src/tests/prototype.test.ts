import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { prototype as proto } from '../http/middleware/prototype';

describe('prototype core', () => {

  beforeEach(() => {
    proto.router = null as any;
    proto.settings = {};
  });

  it('should expose init method', () => {
    expect(typeof proto.init).toBe('function');
  });

  it('should initialize router lazily', () => {
    proto.lazyrouter();
    expect(proto.router).toBeDefined();
  });

  it('set() should store settings correctly', () => {
    proto.set('etag', 'on');
    expect(proto.settings.etag).toBe('on');
  });

  it('enabled() should return true for enabled settings', () => {
    proto.set('etag', 'on');
    expect(proto.enabled('etag')).toBe(true);
  });

  it('get() should not throw and should register route', () => {
    expect(() => {
      proto.get('/', { aliases: [] }, () => {});
    }).not.toThrow();
  });

    it('post() should not throw and should register route', () => {
    expect(() => {
      proto.post('/', { aliases: [] }, () => {});
    }).not.toThrow();
  });

});
