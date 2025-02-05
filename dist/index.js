"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("./express");
const port = 3000;
express_1.app.get('/', (req, res, next) => {
    console.log("foo", next);
    next();
}, (req, res, next) => {
    console.log("teste next");
    next();
});
express_1.app.get('/', (req, res) => {
    res.json({ hello: 'world' });
});
express_1.app.post('/post', (req, res) => {
    res.writeHead(200);
    res.write('Data post :)');
    res.end();
});
express_1.app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}:\n-> http://localhost:${port}`);
});
