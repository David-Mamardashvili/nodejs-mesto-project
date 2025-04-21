import { Request, Response } from "express";
import Card from "../models/card";

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: "Ошибка по умолчанию" }));
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при создании карточки",
        });
      }
      res.status(500).send({ message: "Ошибка по умолчанию" });
    });
};

export const deleteCard = (req: Request, res: Response) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(404)
          .send({ message: "Карточка с указанным _id не найдена" });
      }
      res.status(200).send({ message: "Карточка удалена" });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(400)
          .send({ message: "Передан некорректный _id карточки" });
      }
      res.status(500).send({ message: "Ошибка по умолчанию" });
    });
};

export const likeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true, runValidators: true }
  )
    .then((card) => {
      if (!card) {
        return res
          .status(404)
          .send({ message: "Передан несуществующий _id карточки" });
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({
          message:
            "Переданы некорректные данные для постановки лайка или некорректный _id карточки",
        });
      }
      res.status(500).send({ message: "Ошибка по умолчанию" });
    });
};

export const dislikeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true, runValidators: true }
  )
    .then((card) => {
      if (!card) {
        return res
          .status(404)
          .send({ message: "Передан несуществующий _id карточки" });
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({
          message:
            "Переданы некорректные данные для снятия лайка или некорректный _id карточки",
        });
      }
      res.status(500).send({ message: "Ошибка по умолчанию" });
    });
};
