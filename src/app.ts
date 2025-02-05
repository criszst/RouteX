import App from './interfaces/IApp';

import { proto } from './middleware/prototype';

const http = require("http")


/**
 * Prototype for express app
 * 
 * With this, we can extend express app methods
 */

export function createApp(): App {
    const app: App = function (req, res, next) {
        app.handle(req, res, next);
    } as App;

    
    // const req = Object.create(http.IncomingMessage.prototype)

  
    // const res = Object.create(http.ServerResponse.prototype)
  
    // app.response = res; 
  
    // res.send = function(body: any) {
    //   if (typeof body === 'object') {
    //     this.setHeader('Content-Type', 'application/json');
    //     this.end(JSON.stringify(body), 'utf-8');
    //   } else {
    //     this.setHeader('Content-Type', 'text/plain');
    //     this.end(body, 'utf-8');
    //   }
    //   return this;
    // }
    
    // res.json = function(body: any) {
    //   this.setHeader('Content-Type', 'application/json');
    //   this.end(JSON.stringify(body));
    //   return this;
    // }
  
    // app.request = Object.create(req, {
    //   app: {
    //     configurable: true,
    //     enumerable: true,
    //     writable: true,
    //     value: app,
    //   }
    // })
  
    // app.response = Object.create(res, {
    //   app: {
    //     configurable: true,
    //     enumerable: true,
    //     writable: true,
    //     value: app,
    //   }
    // })

    // Object.setPrototypeOf(app, proto);


    app.init();
    return app;
}

export const app = createApp;
