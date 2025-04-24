import { celebrate, Joi, Segments } from "celebrate";

export const validateSignup = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

export const validateSignin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

export const validateUserId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

export const validateProfileUpdate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

export const validateAvatarUpdate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string()
      .pattern(/^(https?:\/\/)(www\.)?[\w\-~:/?#[\]@!$&'()*+,;=.]+#?$/)
      .required(),
  }),
});

export const validateCardId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

export const validateCardCreate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string()
      .pattern(/^(https?:\/\/)(www\.)?[\w\-~:/?#[\]@!$&'()*+,;=.]+#?$/)
      .required(),
  }),
});
