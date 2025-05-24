"use strict";
const setPrototypeOf = require('setprototypeof');
/**
 * Sets the prototype of the response object to the app.response.
 * This gives the user the ability to use the methods that were
 * defined on the response object.
 *
 * @param {Object} app - The app object.
 * @returns {Function} the middleware function.
 */
exports.init = function (app) {
    return function expressInit(req, res, next) {
        Object.setPrototypeOf(res, app.response);
        next();
    };
};
