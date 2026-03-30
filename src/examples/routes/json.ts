import { app } from "../../api/routex";

export default function mainRoutes() {
  app.get('/json', {aliases: '/js'}, (req, res) => {
    res.json({'json': 'test for json method'})
  });

  app.get('/json2', {aliases: '/js2'}, (req, res) => {
    res.json({'json2': 'test for JSON2 method'})
  })
}
