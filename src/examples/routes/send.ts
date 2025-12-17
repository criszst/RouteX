import { app } from "../../api/routex";
import IServerRequest from "../../http/request/IServerRequest";
import IServerResponse from "../../http/response/IServerResponse";

export default function send(req: IServerRequest, res: IServerResponse) {
  app.get('/sendFile', { aliases: '/send'}, (req: IServerRequest, res: IServerResponse) => {
    res.sendFile('send.html', {
      root: `${process.cwd()}/src`,
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
