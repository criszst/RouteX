import { describe, it, expect, beforeEach } from '@jest/globals';
import { app } from '../api/routex';

describe('App core safety', () => {

  beforeEach(() => {
    app.router = null as any;
  });

  it('app.get should not throw even if router is not initialized', () => {
    expect(() => {
      app.get('/', { aliases: [] }, () => {});
    }).not.toThrow();
  });

  it('app.post should not throw even if router is not initialized', () => {
    expect(() => {
      app.post('/', { aliases: [] }, () => {});
    }).not.toThrow();
  });

});
