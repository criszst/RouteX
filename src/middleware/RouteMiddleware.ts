import IServerRequest from "../http/request/IServerRequest";
import IServerResponse from "../http/response/IServerResponse";

export type RouteXMiddleware = (
  req: IServerRequest,
  res: IServerResponse,
  next: () => void | Promise<void>
) => any;
