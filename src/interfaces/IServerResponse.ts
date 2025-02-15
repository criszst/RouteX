import { ServerResponse } from "http";
import Options from "./IOptions";

interface ExtendedServerResponse extends ServerResponse {
    send: (body: object | string) => void;
    json: (body: object | string) => void;

    download: (path: string) => void;
    redirect: (url: string) => void;

    sendFile: (path: string, options: Options, fn?: Function) => void;
}

export default ExtendedServerResponse;