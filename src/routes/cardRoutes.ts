import express from "express";
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from "../controllers/cards";
import { auth } from "../middlewares/auth";
import { validateCardId, validateCardCreate } from "../middlewares/validators";

const router = express.Router();

router.use(auth);

router.get("/", getCards);

router.post("/", validateCardCreate, createCard);

router.delete("/:cardId", validateCardId, deleteCard);

router.put("/:cardId/likes", validateCardId, likeCard);

router.delete("/:cardId/likes", validateCardId, dislikeCard);

export default router;
