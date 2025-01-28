import { app } from "./express"

app.get("/", (req: any, res: any) => {
  res.writeHead(200)
  res.write("EAEEEE !")
  res.end()
})

app.listen(3000, () => {
  console.log("MyExpress rodando na porta 3000!")
})

