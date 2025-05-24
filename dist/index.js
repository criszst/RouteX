"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("./express");
const port = 3000;
express_1.app.get('/', (req, res, next) => {
    console.log("next -> ", next.name);
    next();
});
express_1.app.get('/', (req, res) => {
    res.json({ 'hello': 'world' });
});
express_1.app.post('/post', (req, res) => {
    res.writeHead(200);
    res.write('Data post :)');
    res.end();
});
express_1.app.get('/download', (req, res) => {
    res.download('./send.html');
});
express_1.app.get('/reds', (req, res) => {
    res.redirect('https://google.com');
});
express_1.app.get('/send', (req, res) => {
    res.sendFile('send.html', {
        attachment: false,
        headers: {
            'X-Custom-Header': 'idk what put here',
        },
    }, (err) => {
        if (err) {
            console.log(err);
        }
    });
});
express_1.app.listen(port, () => {
    console.log(`Server running on port ${port}:\n-> http://localhost:${port}`);
});
