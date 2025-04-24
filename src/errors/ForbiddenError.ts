import { STATUS_CODES } from "../utils/constants";

export default class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = STATUS_CODES.FORBIDDEN;
  }
}
