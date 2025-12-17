import { app } from "../../api/routex";
import IServerRequest from "../../http/request/IServerRequest";
import IServerResponse from "../../http/response/IServerResponse";

export default function mainRoutes() {
  app.get('/', {aliases: '/main'}, (req: IServerRequest, res: IServerResponse) => {
    res.send({'hello': 'world '})
  });
}
