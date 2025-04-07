import { IncomingMessage, ServerResponse } from 'http';
import ExtendedServerResponse from "../interfaces/IServerResponse";

interface GetOptions {
    path: string;
    handlers: Array<(req: IncomingMessage, res: ExtendedServerResponse, next?: any) => void>;
  }
  

export default GetOptions;