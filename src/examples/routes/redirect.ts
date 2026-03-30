import { app } from "../../api/routex";

export default function redirectRoutes() {
  app.get('/redirect', {aliases: '/reds'}, (req, res) => {
    res.redirect('https://www.google.com');
    res.end()
  });
}
