import { app } from "./express"

import { IncomingMessage, ServerResponse } from "http";
import ExtendedServerResponse from "./interfaces/IServerResponse";

const port = 3000


type SvResponse = ExtendedServerResponse;


app.get('/', (req: IncomingMessage, res: SvResponse, next: any) => {
  console.log("next -> ", next.name);

  next();
});


app.get('/', (req: IncomingMessage, res: SvResponse) => {
  res.json({'hello': 'world'})
});

app.post('/post', (req: IncomingMessage, res: SvResponse) => {
  res.writeHead(200)
  res.write('Data post :)');
  res.end();
});



app.get('/download', (req: IncomingMessage, res: SvResponse) => {
  res.download('./send.html');
});


app.get('/reds', (req: IncomingMessage, res: SvResponse) => {
  res.redirect('https://google.com');
})


app.get('/send', (req: IncomingMessage, res: SvResponse) => {
  res.sendFile('send.html', {
    attachment: false,
    headers: {
      'X-Custom-Header': 'idk what put here',
    },
  }, (err: any) => {
    if (err) {
      console.log(err);
    }
  });
})


app.listen(port, () => {
  console.log(`Server running on port ${port}:\n-> http://localhost:${port}`);
});