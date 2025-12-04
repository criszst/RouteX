import { app } from "../express";
import IServerRequest from "../interfaces/server/IServerRequest";
import IServerResponse from "../interfaces/server/IServerResponse";

export default function send(req: IServerRequest, res: IServerResponse) {
  app.get('/sendFile', { aliases: '/send'}, (req: IServerRequest, res: IServerResponse) => {
    res.sendFile('', {
      root: __dirname,
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    }, (err) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.write('Error sending file');
        res.end()
      }
    });
  })
}
