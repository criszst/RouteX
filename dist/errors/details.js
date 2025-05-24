"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorsDetails extends Error {
    constructor(errorName, message, details) {
        super(message);
        // just WOP: Workaround-Oriented Programming :)
        this.name = errorName;
        this.details = details;
    }
    static create(errorName, message, details) {
        const expectedError = `${message}\n
------> ${details.expected} expected, but " ${details.received} " does not match\n`;
        return new ErrorsDetails(errorName, expectedError, details);
    }
}
exports.default = ErrorsDetails;
