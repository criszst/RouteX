import { app } from "../express";
import IServerRequest from "../interfaces/server/IServerRequest";
import IServerResponse from "../interfaces/server/IServerResponse";

export default function mainRoutes() {
  app.get('/', {aliases: '/main'}, (req: IServerRequest, res: IServerResponse, next: any) => {
    console.log("next -> ", next.name);
    next();
  });

  app.get('/', {aliases: '/main'}, (req: IServerRequest, res: IServerResponse) => {
    res.json({'hello': 'world teste 13 '})

    console.log(req.method)
  });
}
