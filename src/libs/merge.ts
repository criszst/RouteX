export const merge = (dest: Object | any, source: Object | any, override?: boolean | true) => {
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

    return dest
}