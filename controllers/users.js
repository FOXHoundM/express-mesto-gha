const bcrypt = require('bcrypt');
const User = require('../models/user');
const { generateToken } = require('../helpers/token');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      next(err);
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
    } else {
      res.status(200).json(user);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).json({ message: 'Неправильные данные введены' });
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
    if (!email || !password) {
      res.status(400).json({ message: 'Invalid credentials' });
    }
    const user = await User.findOne({ email })
      .select('+password');

    if (!user) {
      res.status(401).json({ message: 'Неправильные почта или пароль' });
    }

    const result = await bcrypt.compare(password, user.password);

    if (result) {
      const payload = { _id: user._id };
      const token = generateToken(payload);
      res.status(200)
        .json({ token });
    } else {
      res.status(401).json({ message: 'Неправильные почта или пароль' });
    }
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

  if (!email || !password) {
    res.status(400).json({ message: 'Invalid credentials' });
  }
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
      }
      if (err.code === 11000) {
        res.status(409).json({ message: `Данный ${email} уже существует` });
      } else {
        next(err);
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
