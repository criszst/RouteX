const setPrototypeOf = require('setprototypeof')

// middleware/init.js
exports.init = function(app: { response: object | null; }) {
    return function expressInit(req: any, res: any, next: () => void) {

      Object.setPrototypeOf(res, app.response);
      next();
    }
  }