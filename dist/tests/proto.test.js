"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const prototype = require('../middleware/prototype');
const proto = prototype.prototype;
(0, globals_1.describe)('protoo', () => {
    (0, globals_1.it)('should have a router property', () => {
        (0, globals_1.expect)(proto).toHaveProperty('router');
    });
    (0, globals_1.it)('should have a cache property', () => {
        (0, globals_1.expect)(proto).toHaveProperty('cache');
    });
    (0, globals_1.it)('should have an engines property', () => {
        (0, globals_1.expect)(proto).toHaveProperty('engines');
    });
    (0, globals_1.it)('should have a settings property', () => {
        (0, globals_1.expect)(proto).toHaveProperty('settings');
    });
    (0, globals_1.it)('should have an init method', () => {
        (0, globals_1.expect)(proto.init).toBeInstanceOf(Function);
    });
    (0, globals_1.it)('should have a set method', () => {
        (0, globals_1.expect)(proto.set).toBeInstanceOf(Function);
    });
    (0, globals_1.it)('should have an enabled method', () => {
        (0, globals_1.expect)(proto.enabled).toBeInstanceOf(Function);
    });
    (0, globals_1.it)('should have a handle method', () => {
        (0, globals_1.expect)(proto.handle).toBeInstanceOf(Function);
    });
    (0, globals_1.it)('should have a listen method', () => {
        (0, globals_1.expect)(proto.listen).toBeInstanceOf(Function);
    });
    (0, globals_1.it)('should have a get method', () => {
        (0, globals_1.expect)(proto.get).toBeInstanceOf(Function);
    });
    (0, globals_1.it)('should have a post method', () => {
        (0, globals_1.expect)(proto.post).toBeInstanceOf(Function);
    });
    (0, globals_1.it)('should have a lazyrouter method', () => {
        (0, globals_1.expect)(proto.lazyrouter).toBeInstanceOf(Function);
    });
});
