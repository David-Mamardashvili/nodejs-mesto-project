import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { STATUS_CODES, MESSAGES } from "../utils/constants";

interface IPayload {
  _id: string;
}

const { JWT_SECRET = "dev-secret-key" } = process.env;

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .send({ message: MESSAGES.AUTH_REQUIRED });
  }

  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .send({ message: MESSAGES.UNAUTHORIZED });
    }

    req.user = payload as IPayload;
    next();
  });
};
