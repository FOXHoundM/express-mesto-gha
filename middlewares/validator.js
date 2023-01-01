const { celebrate, Joi } = require('celebrate');
const { isUrlValid } = require('../helpers/isUrlValid');

module.exports.validateSignUp = celebrate({
  body: Joi.object().keys(),
  email: Joi.string().required().email(),
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
  avatar: Joi.string().custom(isUrlValid),
});

module.exports.validateSignIn = celebrate({
  body: Joi.object().keys(),
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

module.exports.validateDeleteCardId = celebrate({
  params: Joi.object().keys,
  cardId: Joi.string().length(24).hex().required(),
});

module.exports.validatePutLike = celebrate({
  params: Joi.object().keys,
  cardId: Joi.string().length(24).hex().required(),
});

module.exports.validateDeleteLike = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

module.exports.validatePostCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().custom(isUrlValid).required(),
  }),
});

module.exports.validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

module.exports.validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(isUrlValid).required(),
  }),
});

module.exports.validateGetUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});
