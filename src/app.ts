import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRoutes";
import cardRouter from "./routes/cardRoutes";

const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb");

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

app.listen(3000);
