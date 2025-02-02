"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("./express");
const port = 3000;
express_1.app.get("/", (req, res) => {
    res.writeHead(200);
    res.write("teste xpto...");
    res.end();
});
express_1.app.get('/2', (req, res) => {
    res.writeHead(200);
    res.write('teste xpto /2');
    res.end();
});
express_1.app.post('/post', (req, res) => {
    res.writeHead(200);
    res.write('Data -> /post');
    res.end();
});
express_1.app.post('/post2', (req, res) => {
    res.writeHead(200);
    res.write('Data -> /post2');
    res.end();
});
express_1.app.listen(port, () => {
    console.log(`server rodando na porta ${3000}:\n-> http://localhost:${3000}`);
});
