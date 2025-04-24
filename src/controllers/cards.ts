import { Request, Response, NextFunction } from "express";
import mongoose, { UpdateQuery } from "mongoose";
import Card, { ICard } from "../models/card";
import NotFoundError from "../errors/NotFoundError";
import BadRequestError from "../errors/BadRequestError";
import ForbiddenError from "../errors/ForbiddenError";
import { STATUS_CODES } from "../utils/constants";

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.status(STATUS_CODES.OK).send(cards))
    .catch(next);
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = String(req.user._id);

  Card.create({ name, link, owner })
    .then((card) => res.status(STATUS_CODES.CREATED).send(card))
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
  const userId = String(req.user._id);

  Card.findById(cardId)
    .orFail(() => new NotFoundError("Карточка не найдена"))
    .then((card) => {
      if (card.owner.toString() !== userId) {
        throw new ForbiddenError("Вы не можете удалить чужую карточку");
      }

      return Card.findByIdAndDelete(cardId).then(() =>
        res.status(STATUS_CODES.OK).send({ message: "Карточка удалена" })
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Некорректный _id карточки"));
      }
      return next(err);
    });
};

const updateCardLikes = (
  update: UpdateQuery<ICard>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, update, { new: true, runValidators: true })
    .orFail(() => new NotFoundError("Передан несуществующий _id карточки"))
    .then((card) => res.status(STATUS_CODES.OK).send(card))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(
          new BadRequestError("Некорректные данные для изменения лайка")
        );
      }
      return next(err);
    });
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const userId = String(req.user._id);
  updateCardLikes({ $addToSet: { likes: userId } }, req, res, next);
};

export const dislikeCard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = String(req.user._id);
  updateCardLikes({ $pull: { likes: userId } }, req, res, next);
};
