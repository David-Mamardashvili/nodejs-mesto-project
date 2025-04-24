import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";
import BadRequestError from "../errors/BadRequestError";
import NotFoundError from "../errors/NotFoundError";
import ConflictError from "../errors/ConflictError";
import UnauthorizedError from "../errors/UnauthorizedError";
import { STATUS_CODES, MESSAGES } from "../utils/constants";

const { JWT_SECRET = "dev-secret-key" } = process.env;

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.status(STATUS_CODES.OK).send(users))
    .catch(next);
};

export const getCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => new NotFoundError(MESSAGES.USER_NOT_FOUND))
    .then((user) => res.status(STATUS_CODES.OK).send(user))
    .catch(next);
};

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => new NotFoundError(MESSAGES.USER_NOT_FOUND))
    .then((user) => res.status(STATUS_CODES.OK).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError(MESSAGES.INVALID_USER_ID));
      }
      return next(err);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then(({ name, about, avatar, email, _id }) =>
      res.status(STATUS_CODES.CREATED).send({ name, about, avatar, email, _id })
    )
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(MESSAGES.DUPLICATE_EMAIL));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError(MESSAGES.BAD_REQUEST_USER_CREATE));
      }
      return next(err);
    });
};

const updateUserField = (
  userId: string,
  updateData: Partial<{ name: string; about: string; avatar: string }>,
  res: Response,
  next: NextFunction
) => {
  User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  })
    .orFail(() => new NotFoundError(MESSAGES.USER_NOT_FOUND))
    .then((user) => res.status(STATUS_CODES.OK).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        const isAvatarUpdate = Object.prototype.hasOwnProperty.call(
          updateData,
          "avatar"
        );
        const message = isAvatarUpdate
          ? MESSAGES.BAD_REQUEST_AVATAR_UPDATE
          : MESSAGES.BAD_REQUEST_PROFILE_UPDATE;

        return next(new BadRequestError(message));
      }
      return next(err);
    });
};

export const updateProfile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, about } = req.body;
  const userId = String(req.user._id);

  updateUserField(userId, { name, about }, res, next);
};

export const updateAvatar = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { avatar } = req.body;
  const userId = String(req.user._id);

  updateUserField(userId, { avatar }, res, next);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(MESSAGES.UNAUTHORIZED);
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError(MESSAGES.UNAUTHORIZED);
        }

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });

        res.status(STATUS_CODES.OK).send({ token });
      });
    })
    .catch(next);
};
