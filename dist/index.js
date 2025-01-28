"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("./express");
const port = 3000;
express_1.app.get("/", (req, res) => {
    res.writeHead(200);
    res.write("teste ...");
    res.end();
});
express_1.app.listen(port, () => {
    console.log(`MyExpress rodando na porta ${3000}:\n-> localhost:${3000}`);
});
