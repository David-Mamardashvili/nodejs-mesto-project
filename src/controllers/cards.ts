import { Request, Response, NextFunction } from "express";
import Card from "../models/card";
import NotFoundError from "../errors/NotFoundError";
import BadRequestError from "../errors/BadRequestError";
import ForbiddenError from "../errors/ForbiddenError";

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          new BadRequestError(
            "Переданы некорректные данные при создании карточки"
          )
        );
      }
      return next(err);
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById(cardId)
    .orFail(() => new NotFoundError("Карточка не найдена"))
    .then((card) => {
      if (card.owner.toString() !== userId) {
        throw new ForbiddenError("Вы не можете удалить чужую карточку");
      }
      return Card.findByIdAndDelete(cardId).then(() =>
        res.status(200).send({ message: "Карточка удалена" })
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Некорректный _id карточки"));
      }
      return next(err);
    });
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true, runValidators: true }
  )
    .orFail(() => new NotFoundError("Передан несуществующий _id карточки"))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(
          new BadRequestError("Некорректные данные для постановки лайка")
        );
      }
      return next(err);
    });
};

export const dislikeCard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true, runValidators: true }
  )
    .orFail(() => new NotFoundError("Передан несуществующий _id карточки"))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(
          new BadRequestError("Некорректные данные для снятия лайка")
        );
      }
      return next(err);
    });
};
