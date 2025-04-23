import { Request, Response } from "express";
import User from "../models/user";

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: "Ошибка по умолчанию" }));
};

export const getUserById = (req: Request, res: Response) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => new Error("NotFound"))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === "NotFound") {
        return res.status(404).send({ message: "Пользователь не найден" });
      }
      if (err.name === "CastError") {
        return res
          .status(400)
          .send({ message: "Передан некорректный _id пользователя" });
      }
      res.status(500).send({ message: "Ошибка по умолчанию" });
    });
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      }
      res.status(500).send({ message: "Ошибка по умолчанию" });
    });
};

export const updateProfile = (req: Request, res: Response) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(() => new Error("NotFound"))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === "NotFound") {
        return res
          .status(404)
          .send({ message: "Пользователь с указанным _id не найден" });
      }
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении профиля",
        });
      }
      res.status(500).send({ message: "Ошибка по умолчанию" });
    });
};

export const updateAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail(() => new Error("NotFound"))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === "NotFound") {
        return res
          .status(404)
          .send({ message: "Пользователь с указанным _id не найден" });
      }
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении аватара",
        });
      }
      res.status(500).send({ message: "Ошибка по умолчанию" });
    });
};
