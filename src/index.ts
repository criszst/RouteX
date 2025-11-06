import path from "path";

import { app } from "./express";

import IServerRequest from "./interfaces/server/IServerRequest";
import IServerResponse from "./interfaces/server/IServerResponse";

import { setupHotReload } from "./utils/hotReload";
import loadRoutes from "./utils/loadRoutes";


const port = 3000;


app.get('/', {aliases: '/main'}, (req: IServerRequest, res: IServerResponse, next: any) => {
  console.log("next -> ", next.name);

  next();
});


app.get('/', {aliases: '/main'}, (req: IServerRequest, res: IServerResponse) => {
  res.json({'hello': 'tesete'})
  console.log(req.method)
})

app.post('/post', (req: IServerRequest, res: IServerResponse) => {
  res.writeHead(200)

  console.log(req.method)
  res.write('Data post :)');
  res.end();
});



app.get('/download', {aliases: '/downloadfile'}, (req: IServerRequest, res: IServerResponse) => {
  res.download('../../../send.html');
});


app.get('/reds', {aliases: '/redirect'}, (req: IServerRequest, res: IServerResponse) => {
  res.redirect('https://google.com')
})




app.get('/send', {aliases: '/sendfile'}, (req: IServerRequest, res: IServerResponse) => {

  res.sendFile(path.join(__dirname, '/send.html'), {

    // EXAMPLE

    // headers: {
    //   'X-Custom-Header': 'xpto',
    //   'Content-Type': 'text/html',
    //   'Content-Disposition': 'inline; filename="send.html"',
    //   'Access-Control-Allow-Method': 'GET, OPTIONS,',
    //   'Access-Control-Allow-Origin': '*',
    // },

  },
   (err: any) => {
    if (err) {
      console.log(err);
    }
  });

  console.log(req.method)
  console.log(__dirname + '/send.html');
});

app.get('/my/ip', {aliases: '/ip'}, (req: IServerRequest, res: IServerResponse) => {
  res.json({'ip': req.socket.remoteAddress || req.socket.localAddress || 'IP not found'});
});

app.get('/cookies', {aliases: '/getcookies'}, (req: IServerRequest, res: IServerResponse) => {
  req.cookies = {key: 'value', key2: 'value2'}
  res.json({'cookies': req.cookies || 'No cookies found'});
});


app.get('/user', {aliases: '/getuser'}, (req: IServerRequest, res: IServerResponse) => {
  res.json({received: req.body});
});


app.get('/esp', {aliases: '/esp32'}, (req: IServerRequest, res: IServerResponse) => {
   res.json({ received: req.body });
  console.log('message from esp32: -> ', req.body);
});


// app.showLogs = () => {
//   console.log("Logs:")
//   console.log("Request:", app.request)
//   console.log("Response:", app.response)
// }



app.setCustom404((req, res) => {
  res.sendFile(path.join(__dirname, '/custom404.html'));
});

app.listen(port, () => {
  setupHotReload(loadRoutes)

  console.log(`Server running on port ${port}:\n-> http://localhost:${port}`);
});
