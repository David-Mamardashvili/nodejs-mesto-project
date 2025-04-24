import express from "express";
import {
  getUsers,
  getCurrentUser,
  getUserById,
  updateProfile,
  updateAvatar,
} from "../controllers/users";
import { auth } from "../middlewares/auth";
import { validateUserId } from "../middlewares/validators";

const router = express.Router();

router.use(auth);

router.get("/", getUsers);

router.get("/me", getCurrentUser);

router.get("/:userId", validateUserId, getUserById);

router.patch("/me", updateProfile);

router.patch("/me/avatar", updateAvatar);

export default router;
