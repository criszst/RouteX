"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PathErrors extends Error {
    constructor(message, details) {
        super(message);
        this.name = "PathError";
        this.details = details;
    }
    static create(message, details) {
        return new PathErrors(message, details);
    }
}
exports.default = PathErrors;
