import IServerRequest from '../../http/request/IServerRequest';
import IServerResponse from "../../http/response/IServerResponse";


interface GetOptions {
    path: string;
    handlers: (req: IServerRequest, res: IServerResponse) => void;
  }


export default GetOptions;
