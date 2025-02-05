import { app } from "./express"

const port = 3000

app.get('/', (req: any, res: any, next: any) => {
  console.log("foo", next)
    next()
}, (req, res, next) => {
    console.log("teste next")
    next()
});

app.get('/', (req: any, res: any) => {
  res.json({hello: 'world'})
});

app.post('/post', (req: any, res: any) => {
  res.writeHead(200)
  res.write('Data post :)');
  res.end();
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}:\n-> http://localhost:${port}`);
});