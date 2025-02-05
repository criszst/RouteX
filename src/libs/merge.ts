export const merge = <Dest, Sorc>(dest: Dest, source: Sorc, override: boolean = true): Dest & Sorc => {
    if (!dest) {
        throw new TypeError('Coloque o destino ai bb ');
    }
    if (!source) {
        throw new TypeError('Ta faltando o sorcito ai');
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
