import { app } from "../express";
import IServerRequest from "../interfaces/server/IServerRequest";
import IServerResponse from "../interfaces/server/IServerResponse";

export default function redirectRoutes() {
  app.get('/redirect', {aliases: '/reds'}, (req: IServerRequest, res: IServerResponse, next: any) => {
    res.redirect('https://www.google.com');
    res.end()
  });
}
