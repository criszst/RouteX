"use strict";
exports.init = function (app) {
    return function expressInit(req, res, next) {
        console.log(Object.setPrototypeOf(req, app.response));
        next();
    };
};
