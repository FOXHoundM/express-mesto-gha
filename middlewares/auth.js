const jwt = require('jsonwebtoken');
const { STATUS_UNAUTHORIZED } = require('../errors/errors');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(STATUS_UNAUTHORIZED)
      .json({ message: 'Ошибка авторизации' });
  }

  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    res.status(STATUS_UNAUTHORIZED)
      .json({ message: 'Ошибка авторизации' });
  }

  req.user = payload;

  next();
};
