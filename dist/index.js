"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("./express");
const myApp = (0, express_1.app)();
myApp.get('/', (req, res) => {
    res.writeHead(200);
    res.write('EAEEEE !');
    res.end();
});
myApp.listen(3000, () => {
    console.log('MyExpress rodando na porta 3000!');
});
