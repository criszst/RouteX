import { app } from "../../api/routex";

export default function mainRoutes() {
  app.get('/', {aliases: '/main'}, (req, res) => {
    res.send({ 'hello': 'world aste ' });
  });
}
