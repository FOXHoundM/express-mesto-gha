const bcrypt = require('bcrypt');
const User = require('../models/user');
const {
  STATUS_SUCCESS,
  STATUS_ERROR,
  NOT_FOUND_MESSAGE,
  ERROR_MESSAGE,
} = require('../errors/errors');
const { generateToken } = require('../helpers/token');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');
const NotFoundError = require('../errors/notFoundError');
const UnauthorizedError = require('../errors/unauthorizedError');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200)
      .json(users))
    .catch(() => {
      res.status(STATUS_ERROR)
        .json({ message: ERROR_MESSAGE });
    });
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.status(200)
          .json(user);
      } else {
        next(new NotFoundError('Resource not found'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неправильные данные введены'));
      } else {
        next(err);
      }
    });
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
      res.status(UnauthorizedError)
        .json({ message: 'Неправильные почта или пароль' });
    }

    const result = await bcrypt.compare(password, user.password);

    if (result) {
      const payload = { _id: user._id };
      const token = generateToken(payload);

      res.status(200)
        .cookie('jwt', token, {
          maxAge: 3600000 * 24,
          httpOnly: true,
        })
        .json({ message: 'Вход выполнен успешно' });
    }
    res.status(UnauthorizedError)
      .json({ message: 'Неправильные почта или пароль' });
  } catch (err) {
    next(err);
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
      .json({
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BadRequestError)
          .json({ message: 'Неправильные данные введены' });
      }
      if (err.code === 11000) {
        res.status(ConflictError)
          .json({ message: `Данный ${email} уже существует` });
      }
      next(err);
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
        res.status(NotFoundError)
          .json({
            message: 'Resource not found',
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(BadRequestError)
          .json({ message: 'Неправильные данные введены' });
      } else {
        res.status(STATUS_ERROR)
          .json({ message: ERROR_MESSAGE });
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
        res.status(NotFoundError)
          .json({
            message: 'Resource not found',
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(BadRequestError)
          .json({ message: 'Неправильные данные введены' });
      } else {
        res.status(STATUS_ERROR)
          .json({ message: ERROR_MESSAGE });
      }
    });
};
