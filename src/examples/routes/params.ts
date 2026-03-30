import App from "../../core/types/IApp";

export default function paramsPage(app: App) {
  app.get('/query', ({aliases: 'qr'}), (req, res) => {
    // just write ? after the url to see the query params
    // kinda like http://localhost:3000/query?name=someValue&age=someAge

    res.json({ 'query': req.query })
  })

  app.get('/params/:id', {aliases: 'ps'}, (req, res) => {
    // just write something after the "/params/" to see the params
    // kinda like http://localhost:3000/params/123

    res.json({ id: req.params.id });
  });
}
