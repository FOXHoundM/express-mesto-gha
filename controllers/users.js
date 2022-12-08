const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.json(users))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400)
          .json({ message: 'Incorrect data entered' });
      } else {
        res.status(500)
          .json({ message: err.message });
      }
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.status(200)
          .json(user);
      } else {
        res.status(404)
          .json({ message: 'User not found' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400)
          .json({ message: 'Incorrect data entered' });
      } else {
        res.status(500)
          .json({ message: err.message });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
  } = req.body;

  User.create({
    name,
    about,
    avatar,
  })
    .then((user) => res.status(201)
      .json(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400)
          .json({ message: 'Incorrect data entered' });
      } else {
        res.status(500)
          .json({ message: err.message });
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
          .json({
            name,
            about,
          });
      } else {
        res.status(404)
          .json({
            message: 'User not found',
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400)
          .json({ message: 'Incorrect data entered' });
      } else {
        res.status(500)
          .json({ message: err.message });
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
          .json({
            avatar,
          });
      } else {
        res.status(404)
          .json({
            message: 'User not found',
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400)
          .json({ message: 'Incorrect data entered' });
      } else {
        res.status(500)
          .json({ message: err.message });
      }
    });
};
