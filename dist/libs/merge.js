"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = void 0;
const merge = (dest, source, override) => {
    if (!dest) {
        throw new TypeError('lança o obj1 aí');
    }
    if (!source) {
        throw new TypeError('esqueceu do obj2 irmao');
    }
    for (const sourceName of Object.getOwnPropertyNames(source)) {
        if (!override && Object.prototype.hasOwnProperty.call(dest, sourceName)) {
            continue;
        }
        const descriptor = Object.getOwnPropertyDescriptor(source, sourceName);
        if (descriptor) {
            Object.defineProperty(dest, sourceName, descriptor);
        }
    }
    return dest;
};
exports.merge = merge;
