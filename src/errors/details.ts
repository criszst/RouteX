import IDetails from "../interfaces/IDetails";

class ErrorsDetails extends Error {
  details: IDetails

  constructor(message: string, details: IDetails) {
    super(message);
    this.name = "Path Error";
    this.details = details;
  }

  public static create(message: string, details: IDetails): ErrorsDetails {
    const expectedError = `${message}\n
------> ${details.expected} expected, but ${details.received} does not match\n`;

    return new ErrorsDetails(expectedError, details);
  }
}

export default ErrorsDetails;