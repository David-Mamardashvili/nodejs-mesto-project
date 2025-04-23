import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import userRouter from "./routes/userRoutes";
import cardRouter from "./routes/cardRoutes";

const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Слишком много запросов, попробуйте позже.",
});
app.use(limiter);

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: "6806708a56b8438eef3da679",
  };
  next();
});

app.use("/users", userRouter);

app.use("/cards", cardRouter);

app.use("*", (req: Request, res: Response) => {
  res.status(404).send({ message: "Запрашиваемый ресурс не найден" });
});

app.listen(3000);
