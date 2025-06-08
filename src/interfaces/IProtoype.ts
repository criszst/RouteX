import IServerRequest from './server/IServerRequest';
import IServerResponse from "./server/IServerResponse";


interface GetOptions {
    path: string;
    handlers: Array<(req: IServerRequest, res: IServerResponse, next?: any) => void>;
  }
  

export default GetOptions;