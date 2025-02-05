import App from './interfaces/IApp';
import { Router } from './router';

const middleware = require('./middleware/init');

const http = require("http")
const mixin = require("merge-descriptors")

const setPrototypeOf = require('setprototypeof')

/**
 * Prototype for express app
 * 
 * With this, we can extend express app methods
 */

const proto = {
    router: {} as Router,
    cache: {},
    engines: {},
    settings: {} as any,

    init() {
        this.router = new Router();
    },

    set(setting: any, value: any) {
        this.settings[setting] = value;

        switch (setting) {
            case 'etag':
                this.set('etag fn', '');
                break;
            case 'query parser':
                this.set('query parser fn', '');
                break;
            case 'trust proxy':
                this.set('trust proxy fn', ''); 
                break;
        }

        return this;
    },

    enabled(setting: any) {
        return Boolean(this.set(setting, ''));
    },

    handle(req: any, res: any, next: any) {
        this.lazyrouter();
    
        if (!res.send) {
            res.send = function (body: any) {
                if (typeof body === 'object') {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(body), 'utf-8');
                } else {
                    res.setHeader('Content-Type', 'text/plain');
                    res.end(body, 'utf-8');
                }
            };
        }
    
        if (!res.json) {
            res.json = function (body: any) {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(body));
            };
        }
    
        this.router.handle(req, res, next);
    },
    
    listen(port: number, callback: () => void) {
        const server = require('http').createServer(this);
        server.listen(port, callback);
    },
    get(path: string, ...handlers: Array<(req: any, res: any, next?: any) => void>) {
        this.router.get(path, ...handlers);
    },
    post(path: string, ...handlers: Array<(req: any, res: any, next?: any) => void>) {
        this.router.post(path, ...handlers);
    },

    lazyrouter() {
        if (!this.router) {
            this.router = new Router({});
            this.router.use(middleware.init(this));
          }
    },

};

export function createApp(): App {
    const app: App = function (req, res, next) {
        app.handle(req, res, next);
    } as App;

    
    const req = Object.create(http.IncomingMessage.prototype)

  
    const res = Object.create(http.ServerResponse.prototype)
  
    app.response = res; 
  
    res.send = function(body: any) {
      if (typeof body === 'object') {
        this.setHeader('Content-Type', 'application/json');
        this.end(JSON.stringify(body), 'utf-8');
      } else {
        this.setHeader('Content-Type', 'text/plain');
        this.end(body, 'utf-8');
      }
      return this;
    }
    
    res.json = function(body: any) {
      this.setHeader('Content-Type', 'application/json');
      this.end(JSON.stringify(body));
      return this;
    }
  
    app.request = Object.create(req, {
      app: {
        configurable: true,
        enumerable: true,
        writable: true,
        value: app,
      }
    })
  
    app.response = Object.create(res, {
      app: {
        configurable: true,
        enumerable: true,
        writable: true,
        value: app,
      }
    })

    Object.setPrototypeOf(app, proto);


    app.init();
    return app;
}

export const app = createApp;
