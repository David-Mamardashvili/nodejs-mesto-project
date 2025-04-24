import { STATUS_CODES } from "../utils/constants";

export default class ConflictError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
    this.statusCode = STATUS_CODES.CONFLICT;
  }
}
