import { app } from "./express"

import { IncomingMessage, ServerResponse } from "http";
import ExtendedServerResponse from "./interfaces/IServerResponse";
import { IPMiddleware } from "./middleware/ip";

const port = 3000


type SvResponse = ExtendedServerResponse;


app.get('/', {alias: '/main'}, (req: IncomingMessage, res: SvResponse, next: any) => {
  console.log("next -> ", next.name);

  next();
});


app.get('/', {alias: '/main'}, (req: IncomingMessage, res: SvResponse) => {
  res.json({'hello': 'world'})
});

app.post('/post', (req: IncomingMessage, res: SvResponse) => {
  res.writeHead(200)
  res.write('Data post :)');
  res.end();
});



app.get('/download', {alias: '/downloadfile'}, (req: IncomingMessage, res: SvResponse) => {
  res.download('./send.html');
});


app.get('/reds', {alias: '/redirect'}, (req: IncomingMessage, res: SvResponse) => {
  res.redirect('https://google.com')
})

app.get('/send', {alias: '/sendfile'}, (req: IncomingMessage, res: SvResponse) => {
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


app.listen(port, () => {
  console.log(`Server running on port ${port}:\n-> http://localhost:${port}`);
});