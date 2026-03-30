import { app } from "../../api/routex";

export default function send() {
  app.get('/sendFile', { aliases: '/send'}, (req, res) => {
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
