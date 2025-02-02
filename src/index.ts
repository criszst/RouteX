import { app } from "./express"

const port = 3000

app.get("/", (req: any, res: any, next) => {
  console.log(next)
  next()
})

app.get('/', (req, res) => {
  res.writeHead(200)
  res.write('next');
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

