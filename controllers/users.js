const bcrypt = require('bcrypt');
const User = require('../models/user');
const { generateToken } = require('../helpers/token');
const { InternalServerError } = require('../errors/serverError');
// const UnauthorizedError = require('../errors/unauthorizedError');
// const BadRequestError = require('../errors/badRequestError');
// const ConflictError = require('../errors/conflictError');
// const NotFoundError = require('../errors/notFoundError');

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

module.exports.getUserInfo = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      // return next(new NotFoundError('Пользователь не найден'));
    } else {
      res.status(200).json(user);
    }
    // return res.status(200).json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).json({ message: 'Неправильные данные введены' });
      // return next(new BadRequestError('Неправильные данные введены'));
    }
    next(err);
  }
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
      res.status(401).json({ message: 'Неправильные почта или пароль' });
      // return (new UnauthorizedError('Неправильные почта или пароль'));
    } else {
      res.status(400).json({ message: 'Неправильные данные введены' })
    }

    const result = await bcrypt.compare(password, user.password);

    if (result) {
      const payload = { _id: user._id };
      const token = generateToken(payload);

      res.status(200)
        .json({ token });
    }
    else {
      res.status(400).json({ message: 'Неправильные данные введены' })
    }
    // res.status(401).json({ message: 'Неправильные почта или пароль' });

    // return next(new UnauthorizedError('Неправильные почта или пароль'));
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
        res.status(400).json({ message: 'Неправильные данные введены' });
        // return next(new BadRequestError('Неправильные данные введены'));
      }
      if (err.code === 11000) {
        res.status(409).json({ message: `Данный ${email} уже существует` });
        // return next(new ConflictError(`Данный ${email} уже существует`));
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
