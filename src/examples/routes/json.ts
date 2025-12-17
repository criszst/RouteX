import { app } from "../../api/routex";
import IServerRequest from "../../http/request/IServerRequest";
import IServerResponse from "../../http/response/IServerResponse";

export default function mainRoutes() {
  app.get('/json', {aliases: '/js'}, (req: IServerRequest, res: IServerResponse) => {
    res.json({'json': 'test for send method'})
  });
}
