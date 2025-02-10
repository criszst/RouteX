"use strict";
module.exports = {
    getType: jest.fn((path) => {
        const paths = {
            '.pdf': 'application/pdf',
            '.jpg': 'image/jpeg',
            'json': 'application/json',
        };
        for (const key in paths) {
            if (path.endsWith(key)) {
                return paths[key];
            }
        }
        return 'application/octet-stream';
    }),
};
