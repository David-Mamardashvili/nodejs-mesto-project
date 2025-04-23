import express from "express";
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from "../controllers/cards";
import { auth } from "../middlewares/auth";

const router = express.Router();

router.use(auth);

router.get("/", getCards);

router.post("/", createCard);

router.delete("/:cardId", deleteCard);

router.put("/:cardId/likes", likeCard);

router.delete("/:cardId/likes", dislikeCard);

export default router;
