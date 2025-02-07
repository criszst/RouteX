import { ServerResponse } from "http";
import { app } from "./express"
import ExtendedServerResponse from "./interfaces/IServerResponse";

const port = 3000

// TODO: Change the type of response, cause it is not the same as the one in express

// just improvising
type extendsServerResponse = ServerResponse extends  ExtendedServerResponse? ExtendedServerResponse : any

app.get('/', (req: any, res: extendsServerResponse, next: any) => {
  console.log("next -> ", next.name);
  next();
});


app.get('/', (req: any, res: extendsServerResponse) => {
  res.json({'hello': 'world'})
});

app.get('/download', (req: any, res: any) => {

  res.download('./download.test.txt');
  res.write('Downloading...')
});


app.post('/post', (req: any, res: extendsServerResponse) => {
  res.writeHead(200)
  res.write('Data post :)');
  res.end();
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}:\n-> http://localhost:${port}`);
});