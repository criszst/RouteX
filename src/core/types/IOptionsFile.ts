interface OptionsSendMethod {
    attachment?: boolean;
    maxAge?: number;
    root?: string;
    headers?: {
        [key: string]: string;
    }
}

export default OptionsSendMethod;
