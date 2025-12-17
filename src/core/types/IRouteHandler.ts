import IServerRequest from "../../http/request/IServerRequest";
import IServerResponse from "../../http/response/IServerResponse";

export type RouteHandler = (
  req: IServerRequest,
  res: IServerResponse
) => void | Promise<void>;
