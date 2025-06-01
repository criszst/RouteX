import { app } from "./express"

import { IncomingMessage, ServerResponse } from "http";
import ExtendedServerResponse from "./interfaces/IServerResponse";
import { IPMiddleware } from "./middleware/ip";

const port = 3000;



app.get('/', {aliases: '/main'}, (req: IncomingMessage, res: ExtendedServerResponse, next: any) => {
  console.log("next -> ", next.name);

  next();
});


app.get('/', {aliases: '/main'}, (req: IncomingMessage, res: ExtendedServerResponse) => {
  res.json({'hello': 'world'})
});

app.post('/post', (req: IncomingMessage, res: ExtendedServerResponse) => {
  res.writeHead(200)
  res.write('Data post :)');
  res.end();
});



app.get('/download', {aliases: '/downloadfile'}, (req: IncomingMessage, res: ExtendedServerResponse) => {
  res.download('./send.html');
});


app.get('/reds', {aliases: '/redirect'}, (req: IncomingMessage, res: ExtendedServerResponse) => {
  res.redirect('https://google.com')
})

app.get('/send', {aliases: '/sendfile'}, (req: IncomingMessage, res: ExtendedServerResponse) => {
  res.sendFile('send.html', {
    headers: {
      'X-Custom-Header': 'xpto',
      'Content-Type': 'text/html',
      'Content-Disposition': 'inline; filename="send.html"',
      'Access-Control-Allow-Method': 'GET, OPTIONS,',
      'Access-Control-Allow-Origin': '*',
    },
    
  }, (err: any) => {
    if (err) {
      console.log(err);
    }
  });
});

app.get('/my/ip', {aliases: '/ip'}, (req: IncomingMessage, res: ExtendedServerResponse) => {
  res.send(req.socket.remoteAddress || req.socket.localAddress || 'IP not found');
});


app.listen(port, () => {
  console.log(`Server running on port ${port}:\n-> http://localhost:${port}`);
});