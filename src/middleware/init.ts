exports.init = function(app: any) {
    return function expressInit(req: any, res: any, next: () => void) {
        console.log(Object.setPrototypeOf(req, app.response));
        next();
    }
}