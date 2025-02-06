import {describe, expect, it} from '@jest/globals';

const prototype = require('../middleware/prototype');
const proto = prototype.prototype;

describe('proto', () => {
    it('should have a router property', () => {
      expect(proto).toHaveProperty('router');
    });
  
    it('should have a cache property', () => {
      expect(proto).toHaveProperty('cache');
    });
  
    it('should have an engines property', () => {
      expect(proto).toHaveProperty('engines');
    });
  
    it('should have a settings property', () => {
      expect(proto).toHaveProperty('settings');
    });
  
    it('should have an init method', () => {
      expect(proto.init).toBeInstanceOf(Function);
    });
  
    it('should have a set method', () => {
      expect(proto.set).toBeInstanceOf(Function);
    });
  
    it('should have an enabled method', () => {
      expect(proto.enabled).toBeInstanceOf(Function);
    });
  
    it('should have a handle method', () => {
      expect(proto.handle).toBeInstanceOf(Function);
    });
  
    it('should have a listen method', () => {
      expect(proto.listen).toBeInstanceOf(Function);
    });
  
    it('should have a get method', () => {
      expect(proto.get).toBeInstanceOf(Function);
    });
  
    it('should have a post method', () => {
      expect(proto.post).toBeInstanceOf(Function);
    });
  
    it('should have a lazyrouter method', () => {
      expect(proto.lazyrouter).toBeInstanceOf(Function);
    });
  });