"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const prototype_1 = require("../middleware/prototype");
const proto = prototype_1.prototype;
(0, globals_1.describe)('proto', () => {
    (0, globals_1.beforeEach)(() => {
        // Ensure proto.router is properly initialized
        proto.router = {
            handle: jest.fn(),
        };
    });
    (0, globals_1.it)('should have an init method', () => {
        (0, globals_1.expect)(proto.init).toBeInstanceOf(Function);
    });
    // --- test the set method
    (0, globals_1.it)('should set the etag fn setting', () => {
        proto.set('etag', 'value etag');
        (0, globals_1.expect)(proto.settings['etag']).toBe('value etag');
    });
    (0, globals_1.it)('should set the query parser fn setting', () => {
        proto.set('query parser', 'value parser ');
        (0, globals_1.expect)(proto.settings['query parser']).toBe('value parser ');
    });
    (0, globals_1.it)('should set the trust proxy fn setting', () => {
        proto.set('trust proxy', 'value proxy');
        (0, globals_1.expect)(proto.settings['trust proxy']).toBe('value proxy');
    });
    // --- test the enabled method
    (0, globals_1.it)('should enable the etag fn setting', () => {
        (0, globals_1.expect)(proto.enabled('etag')).toBe(true);
    });
    (0, globals_1.it)('should enable the query parser fn setting', () => {
        (0, globals_1.expect)(proto.enabled('query parser')).toBe(true);
    });
    (0, globals_1.it)('should enable the trust proxy fn setting', () => {
        (0, globals_1.expect)(proto.enabled('trust proxy')).toBe(true);
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
