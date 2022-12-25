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

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(STATUS_SUCCESS)
      .json(users))
    .catch(() => {
      res.status(STATUS_ERROR)
        .json({ message: ERROR_MESSAGE });
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.status(STATUS_SUCCESS)
          .json(user);
      } else {
        res.status(STATUS_NOT_FOUND)
          .json({ message: NOT_FOUND_MESSAGE });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST)
          .json({ message: BAD_REQUEST_MESSAGE });
      } else {
        res.status(STATUS_ERROR)
          .json({ message: ERROR_MESSAGE });
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

module.exports.createUser = (req, res) => {
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
      .json(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST)
          .json({ message: BAD_REQUEST_MESSAGE });
      }
      if (err.code === 11000) {
        res.status(409)
          .json({ message: `Данный ${email} уже существует` });
      } else {
        res.status(STATUS_ERROR)
          .json({ message: ERROR_MESSAGE });
      }
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
