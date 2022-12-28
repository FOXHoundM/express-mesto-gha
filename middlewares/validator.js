const { celebrate, Joi } = require('celebrate');
const isURL = require('validator/es/lib/isURL');

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

module.exports.validateAvatarUpdate = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .required()
      .custom((value) => {
        if (!isURL(value)) {
          throw new Error('Ошибка валидации. Введите правильный URL');
        }
        return value;
      }),
  }),
});

module.exports.validateUserId = celebrate({
  params: Joi.object().keys({
    id: Joi.string()
      .required().hex().length(24),
  }),
});

module.exports.validateCardCreation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string()
      .required()
      .custom((value) => {
        if (!isURL(value)) {
          throw new Error('Ошибка валидации. Введите правильный URL');
        }
        return value;
      }),
  }),
});

module.exports.validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string()
      .required().hex().length(24),
  }),
});
