import { ServerResponse } from "http";

interface ExtendedServerResponse extends ServerResponse {
    send: (body: object | string) => void;
    json: (body: object | string) => void;

    download: (path: string) => void;
    redirect: (url: string) => void;
}

export default ExtendedServerResponse;