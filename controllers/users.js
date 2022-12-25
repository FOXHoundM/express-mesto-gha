const bcrypt = require('bcrypt');
const User = require('../models/user');
const {
  STATUS_SUCCESS,
  STATUS_ERROR,
  STATUS_NOT_FOUND,
  NOT_FOUND_MESSAGE,
  STATUS_BAD_REQUEST,
  BAD_REQUEST_MESSAGE,
  ERROR_MESSAGE,
  STATUS_CREATED,
  STATUS_UNAUTHORIZED,
  UNAUTHORIZED_MESSAGE,
} = require('../errors/errors');
const { generateToken } = require('../helpers/token');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');
const NotFoundError = require('../errors/notFoundError');

// module.exports.getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.status(STATUS_SUCCESS)
//       .json(users))
//     .catch(() => {
//       res.status(STATUS_ERROR)
//         .json({ message: ERROR_MESSAGE });
//     });
// };

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.status(STATUS_SUCCESS)
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

module.exports.login = (req, res) => {
  const {
    email,
    password,
  } = req.body;

  return User.findUserByCredentials(
    email,
    password,
  )
    .then((user) => {
      const payload = { _id: user._id };
      const token = generateToken(payload);

      return res.status(STATUS_SUCCESS)
        .json({ token });
    })
    .catch(() => {
      res.status(STATUS_UNAUTHORIZED)
        .json({ message: UNAUTHORIZED_MESSAGE });
    });
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
    .then((user) => res.status(STATUS_CREATED)
      .json({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Неправильные данные введены'));
      }
      if (err.code === 11000) {
        return next(new ConflictError(`Данный ${email} уже существует`));
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
        res.status(STATUS_SUCCESS)
          .json(user);
      } else {
        res.status(STATUS_NOT_FOUND)
          .json({
            message: NOT_FOUND_MESSAGE,
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST)
          .json({ message: BAD_REQUEST_MESSAGE });
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
        res.status(STATUS_SUCCESS)
          .json(user);
      } else {
        res.status(STATUS_NOT_FOUND)
          .json({
            message: NOT_FOUND_MESSAGE,
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST)
          .json({ message: BAD_REQUEST_MESSAGE });
      } else {
        res.status(STATUS_ERROR)
          .json({ message: ERROR_MESSAGE });
      }
    });
};
