const router = require('express')
  .Router();
const { celebrate, Joi } = require('celebrate');
const { isUrlValid } = require('../helpers/isUrlValid');

const {
  getUsers,
  getUserById,
  updateUser,
  changeAvatar,
  getUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserInfo);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(isUrlValid).required(),
  }),
}), changeAvatar);

module.exports = router;
