"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorsDetails extends Error {
    constructor(message, details) {
        super(message);
        // just WOP: workaround-oriented programming :)
        this.name = `${message.split(' ')[0]} Error`;
        this.details = details;
    }
    static create(message, details) {
        const expectedError = `${message}\n
------> ${details.expected} expected, but " ${details.received} " does not match\n`;
        return new ErrorsDetails(expectedError, details);
    }
}
exports.default = ErrorsDetails;
