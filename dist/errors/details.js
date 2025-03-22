"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorsDetails extends Error {
    constructor(message, details) {
        super(message);
        this.name = ErrorsDetails.name;
        this.details = details;
    }
    static create(message, details) {
        const expectedError = `${message}\n
------> ${details.expected} expected, but ${details.received} does not match\n`;
        return new ErrorsDetails(expectedError, details);
    }
}
exports.default = ErrorsDetails;
