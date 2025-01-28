"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("./express");
express_1.app.get("/", (req, res) => {
    res.writeHead(200);
    res.write("EAEEEE !");
    res.end();
});
express_1.app.listen(3000, () => {
    console.log("MyExpress rodando na porta 3000!");
});
