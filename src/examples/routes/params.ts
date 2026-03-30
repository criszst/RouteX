import { app } from "../../api/routex";
import App from "../../core/types/IApp";
import IServerRequest from "../../http/request/IServerRequest";
import IServerResponse from "../../http/response/IServerResponse";

export default function paramsPage() {
  app.get('/params', ({aliases: 'ps'}), (req: IServerRequest, res: IServerResponse) => {
    res.json({ 'querys': 'test' })
  })
}
