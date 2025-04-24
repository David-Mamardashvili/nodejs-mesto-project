import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../utils/constants";

export const errorHandler = (
  err: { statusCode?: number; message: string },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === STATUS_CODES.INTERNAL_SERVER_ERROR
        ? "На сервере произошла ошибка"
        : message,
  });
};
