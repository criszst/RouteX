interface Options {
    attachment?: boolean;
    maxAge?: number;
    root?: string;
    headers?: {
        [key: string]: string;
    }
}

export default Options;