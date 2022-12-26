const bcrypt = require('bcrypt');
const User = require('../models/user');
const { generateToken } = require('../helpers/token');
const { InternalServerError } = require('../errors/serverError');
const UnauthorizedError = require('../errors/unauthorizedError');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
      .orFail(() => new Error('Пользователи не найдены'));
    return res.status(200)
      .json(users);
  } catch (err) {
    return next(new InternalServerError('Произошла ошибка загрузки данных о пользователях'));
  }
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.status(200)
          .json(user);
      } else {
        res.status(404)
          .json({ message: 'Resource not found' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400)
          .json({ message: 'Неправильные данные введены' });
      } else {
        next(err);
      }
    });
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(404)
          .json({ message: 'Пользователь с данным ID не найден' });
      }
      res.status(201)
        .json(user);
    })
    .catch(next);
};

module.exports.login = async (req, res, next) => {
  try {
    const {
      email,
      password,
    } = req.body;
    const user = await User.findOne({ email })
      .select('+password');

    if (!user) {
      throw new UnauthorizedError('Неправильные почта или пароль');
    }

    const result = await bcrypt.compare(password, user.password);

    if (result) {
      const payload = { _id: user._id };
      const token = generateToken(payload);

      return res.status(200)
        .cookie('jwt', token, {
          maxAge: 3600000 * 24,
          httpOnly: true,
        })
        .json({ message: 'Вход выполнен успешно' });
    }
    throw new UnauthorizedError('Неправильные почта или пароль');
  } catch (err) {
    return next(err);
  }
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201)
      .json(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400)
          .json({ message: 'Неправильные данные введены' });
      }
      if (err.code === 11000) {
        return res.status(409)
          .json({ message: `Данный ${email} уже существует` });
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res) => {
  const {
    name,
    about,
  } = req.body;

  User.findByIdAndUpdate(req.user._id, {
    name,
    about,
  }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) {
        res.status(200)
          .json(user);
      } else {
        res.status(404)
          .json({
            message: 'Resource not found',
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400)
          .json({ message: 'Неправильные данные введены' });
      } else {
        res.status(500)
          .json({ message: 'Произошла ошибка загрузки данных' });
      }
    });
};

module.exports.changeAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) {
        res.status(200)
          .json(user);
      } else {
        res.status(404)
          .json({
            message: 'Resource not found',
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400)
          .json({ message: 'Неправильные данные введены' });
      } else {
        res.status(500)
          .json({ message: 'Произошла ошибка загрузки данных' });
      }
    });
};
