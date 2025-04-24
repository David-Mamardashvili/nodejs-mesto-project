export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const MESSAGES = {
  CARD_DELETED: "Карточка удалена",
  USER_NOT_FOUND: "Пользователь не найден",
  INVALID_USER_ID: "Передан некорректный _id пользователя",
  INVALID_CARD_ID: "Некорректный _id карточки",
  UNAUTHORIZED: "Неправильные почта или пароль",
  FORBIDDEN_CARD_DELETE: "Вы не можете удалить чужую карточку",
  CARD_NOT_FOUND: "Карточка не найдена",
  DUPLICATE_EMAIL: "Пользователь с таким email уже существует",
  BAD_REQUEST_USER_CREATE:
    "Переданы некорректные данные при создании пользователя",
  BAD_REQUEST_PROFILE_UPDATE:
    "Переданы некорректные данные при обновлении профиля",
  BAD_REQUEST_AVATAR_UPDATE:
    "Переданы некорректные данные при обновлении аватара",
  BAD_REQUEST_CARD_CREATE: "Переданы некорректные данные при создании карточки",
  INVALID_LIKE_DATA: "Некорректные данные для изменения лайка",
  INTERNAL_SERVER_ERROR: "На сервере произошла ошибка",
  TOO_MANY_REQUESTS: "Слишком много запросов, попробуйте позже.",
  ROUTE_NOT_FOUND: "Запрашиваемый ресурс не найден",
};
