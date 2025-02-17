import IPathErrors from "./interfaces/IPathErrors";

class PathErrors extends Error {
  details: IPathErrors;
  
  constructor(message: string, details: IPathErrors) {
    super(message);
    this.name = "PathError";
    this.details = details;
  }
}

export default PathErrors;