import { STATUS_CODES } from "../utils/constants";

export default class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_CODES.NOT_FOUND;
  }
}
