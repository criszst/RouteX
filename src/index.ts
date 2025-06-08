import { app } from "./express"

import { IncomingMessage } from "http";
import IServerResponse from "./interfaces/server/IServerResponse";
import IServerRequest from "./interfaces/server/IServerRequest";

const port = 3000;



app.get('/', {aliases: '/main'}, (req: IServerRequest, res: IServerResponse, next: any) => {
  console.log("next -> ", next.name);

  next();
});


app.get('/', {aliases: '/main'}, (req: IServerRequest, res: IServerResponse) => {
  res.json({'hello': 'world'})
  console.log(req.method)
});

app.post('/post', (req: IServerRequest, res: IServerResponse) => {
  res.writeHead(200)
  
  console.log(req.method)
  res.write('Data post :)');
  res.end();
});



app.get('/download', {aliases: '/downloadfile'}, (req: IServerRequest, res: IServerResponse) => {
  res.download('../../send.html');
});


app.get('/reds', {aliases: '/redirect'}, (req: IServerRequest, res: IServerResponse) => {
  res.redirect('https://google.com')
})

app.get('/send', {aliases: '/sendfile'}, (req: IServerRequest, res: IServerResponse) => {
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

  console.log(req.method)
});

app.get('/my/ip', {aliases: '/ip'}, (req: IServerRequest, res: IServerResponse) => {
  res.json({'ip': req.socket.remoteAddress || req.socket.localAddress || 'IP not found'});
});


app.listen(port, () => {
  console.log(`Server running on port ${port}:\n-> http://localhost:${port}`);
});