import { app } from "./express"

const port = 3000

app.get("/", (req: any, res: any) => {
  res.writeHead(200)
  res.write("teste ...")
  res.end()
})

app.listen(port, () => {
  console.log(`MyExpress rodando na porta ${3000}:\n-> http://localhost:${3000}`)
})

