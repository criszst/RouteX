import { IncomingMessage, ServerResponse } from 'http';

interface GetOptions {
    path: string;
    handlers: Array<(req: IncomingMessage, res: ServerResponse, next?: any) => void>;
  }
  

export default GetOptions;