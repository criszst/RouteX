import { app } from "./express"

const port = 3000

app.get("/", (req: any, res: any) => {
  res.writeHead(200)
  res.write("teste xpto...")
  res.end()
})

// TODO: implement params in route
// for now, just the first param is accepted
app.get('/:id', (req: any, res: any) => {
  res.writeHead(200)
  res.write(req.params.id)
  res.end()
})

app.listen(port, () => {
  console.log(`server rodando na porta ${3000}:\n-> http://localhost:${3000}`)
})

