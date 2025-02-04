"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("./express");
const port = 3000;
express_1.app.get('/', (req, res, next) => {
    console.log('\nMiddleware 1');
    next();
});
express_1.app.get('/', (req, res) => {
    res.writeHead(200);
    console.log('\nMiddleware 2');
    res.write('Resposta do middleware 2');
    res.send("hello world");
    res.end();
});
express_1.app.post('/post', (req, res) => {
    res.writeHead(200);
    res.write('POST request recebido ' + req.name);
    res.send('post send');
    res.end();
});
express_1.app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}:\n-> http://localhost:${port}`);
});
