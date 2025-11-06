/**
 * Merge two objects together and return the merged object.
 * More likely to be used in a library merge.
 *
 * @param dest The destination object.
 * @param source The source object.
 * @param override Whether to override existing properties.
 * @returns The merged object.
 */

export const merge = <Dest, Sorc>(dest: Dest, source: Sorc, override: boolean = true): Dest & Sorc => {
    if (!dest) {
        throw new TypeError('The destination object is undefined :/');
    }
    if (!source) {
        throw new TypeError('The source object is undefined :/');
    }

    for (const sourceName of Object.getOwnPropertyNames(source) as Array<keyof Sorc>) {
        if (!override && Object.prototype.hasOwnProperty.call(dest, sourceName)) {
            continue;
        }

        const descriptor = Object.getOwnPropertyDescriptor(source, sourceName);

        if (descriptor) {
            Object.defineProperty(dest, sourceName, descriptor);
        }

    }

    return dest as Dest & Sorc;
}
