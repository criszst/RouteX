"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PathErrors extends Error {
    constructor(message, details) {
        super(message);
        this.name = "PathError";
        this.details = details;
    }
}
exports.default = PathErrors;
