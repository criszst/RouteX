import { app } from "../../api/routex";
import fs from "fs";

export default function allRoutes() {
  const routes = fs.readdirSync(`${process.cwd()}/src/examples/routes`).map(file => file.replace('.ts', ''))

  app.get('/allRoutes', {aliases: 'all'}, (req, res) => {
    res.json({ 'all_routes': routes })
  })
}
