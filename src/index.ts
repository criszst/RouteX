import { app } from './express';

const myApp = app();

myApp.get('/', (req: any, res: any) => {
  res.writeHead(200);
  res.write('EAEEEE !');
  res.end();
});

myApp.listen(3000, () => {
  console.log('MyExpress rodando na porta 3000!');
});
