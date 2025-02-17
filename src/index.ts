import { ServerResponse } from "http";
import { app } from "./express"
import ExtendedServerResponse from "./interfaces/IServerResponse";

const port = 3000

// TODO: Change the type of response, cause it is not the same as the one in express

// just improvising
type extendsServerResponse<T> = ServerResponse extends T? ServerResponse : any
type SvResponse = extendsServerResponse<ExtendedServerResponse>


app.get('/', (req: SvResponse, res: SvResponse, next: any) => {
  console.log("next -> ", next.name);
  next();
});


app.get('/', (req: SvResponse, res: SvResponse) => {
  res.json({'hello': 'world'})
});

app.post('/post', (req: SvResponse, res: SvResponse) => {
  res.writeHead(200)
  res.write('Data post :)');
  res.end();
});



app.get('/download', (req: SvResponse, res: SvResponse) => {
  res.download('./download.test.txt');
});


app.get('/reds', (req: SvResponse, res: SvResponse) => {
  res.redirect('/');
})


app.get('/send', (req: SvResponse, res: SvResponse) => {
  res.sendFile('./../download.test.txt', {})
})


app.listen(port, () => {
  console.log(`Server running on port ${port}:\n-> http://localhost:${port}`);
});