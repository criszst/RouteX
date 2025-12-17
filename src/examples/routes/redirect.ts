import { app } from "../../api/routex";
import IServerRequest from "../../http/request/IServerRequest";
import IServerResponse from "../../http/response/IServerResponse";

export default function redirectRoutes() {
  app.get('/redirect', {aliases: '/reds'}, (req: IServerRequest, res: IServerResponse) => {
    res.redirect('https://www.google.com');
    res.end()
  });
}
