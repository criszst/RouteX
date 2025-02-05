"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = void 0;
const merge = (dest, source, override = true) => {
    if (!dest) {
        throw new TypeError('Coloque o destino ai bb ');
    }
    if (!source) {
        throw new TypeError('Ta faltando o sorcito ai');
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
