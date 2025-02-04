import { app } from "./express"

const port = 3000

app.get('/', (req: any, res: any, next: any) => {
  console.log('\nMiddleware 1');
  next();
});

app.get('/', (req: any, res: any) => {
  res.writeHead(200)

  console.log('\nMiddleware 2');

  res.write('Resposta do middleware 2');
  res.send("hello world")
  res.end();
});

app.post('/post', (req: any, res: any) => {
  res.writeHead(200)
  res.write('POST request recebido ' + req.name);
  res.send('post send');
  res.end();
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}:\n-> http://localhost:${port}`);
});