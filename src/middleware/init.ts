const setPrototypeOf = require('setprototypeof')

exports.init = function(app: any) {
    return function expressInit(req: any,res: any, next: () => void) {
        setPrototypeOf(res, app.response);
        next();
    }
}