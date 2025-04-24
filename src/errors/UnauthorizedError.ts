import { STATUS_CODES } from "../utils/constants";

export default class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = STATUS_CODES.UNAUTHORIZED;
  }
}
