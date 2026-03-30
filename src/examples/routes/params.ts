import { app } from "../../api/routex";

import IServerRequest from "../../http/request/IServerRequest";
import IServerResponse from "../../http/response/IServerResponse";

export default function paramsPage() {
  app.get('/params', ({aliases: 'ps'}), (req: IServerRequest, res: IServerResponse) => {
    // just write ? after the url to see the query params
    // like http://localhost:3000/params?name=value

    res.json({ 'querys': req.query })
  })
}
