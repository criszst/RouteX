interface Options {
    attachment?: boolean;
    maxAge?: number;
    root: undefined;
    headers?: {
        [key: string]: string;
    }
}

export default Options;