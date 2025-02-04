import { app } from "./express"

const port = 3000

app.get('/', (req: any, res: any, next: any) => {
  console.log(next.name)
  next()
})

app.get('/', (req, res) => {
  res.writeHead(200)
  res.write('next teste express');
  res.end();
});

app.post('/post',(req,res) => {
  res.writeHead(200)
  res.write('Data -> /post');
  res.end();
})


app.listen(port, () => {
  console.log(`server rodando na porta ${3000}:\n-> http://localhost:${3000}`)
})

