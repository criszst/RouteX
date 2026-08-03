import IDetails from "../../core/types/IDetails";
import { colors } from "../../utils/ConsoleColors";

class ErrorsDetails extends Error {
  details: IDetails

  // TODO: add self checking for details
  constructor(errorName: string, message: string, details: IDetails) {
    super(message);

    // just WOP: Workaround-Oriented Programming :)
    this.name = errorName;

    this.details = details;
  }

  public static create(errorName: string, message: string, details: IDetails): ErrorsDetails {
    const expectedError =
      `${colors.red} ${message}
------> ${details.expected} expected, but " ${details.received} " does not match\n`;


    return new ErrorsDetails(errorName, expectedError, details);
  }
}

export default ErrorsDetails
