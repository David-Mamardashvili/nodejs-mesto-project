import { STATUS_CODES } from "../utils/constants";

export default class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = STATUS_CODES.BAD_REQUEST;
  }
}
