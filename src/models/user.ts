import { Schema, model } from "mongoose";
import isEmail from "validator/lib/isEmail";

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

const urlRegex = /^(https?:\/\/)(www\.)?[\w\-._~:/?#[\]@!$&'()*+,;=]+#?$/;

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      default: "Жак-Ив Кусто",
      minlength: [2, 'Минимальная длина поля "name" — 2'],
      maxlength: [30, 'Максимальная длина поля "name" — 30'],
    },
    about: {
      type: String,
      default: "Исследователь",
      minlength: [2, 'Минимальная длина поля "about" — 2'],
      maxlength: [200, 'Максимальная длина поля "about" — 200'],
    },
    avatar: {
      type: String,
      default:
        "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
      validate: {
        validator: (v: string) => urlRegex.test(v),
        message: 'Поле "avatar" должно быть валидным URL',
      },
    },
    email: {
      type: String,
      required: [true, 'Поле "email" должно быть заполнено'],
      unique: true,
      validate: {
        validator: (v: string) => isEmail(v),
        message: 'Поле "email" должно быть валидным адресом',
      },
    },
    password: {
      type: String,
      required: [true, 'Поле "password" должно быть заполнено'],
      select: false,
    },
  },
  { versionKey: false }
);

export default model<IUser>("user", userSchema);
