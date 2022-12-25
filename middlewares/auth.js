const jwt = require('jsonwebtoken');
const { secretKey } = require('../helpers/token');
const UnauthorizedError = require('../errors/unauthorizedError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    res.status(UnauthorizedError)
      .json({ message: 'Ошибка авторизации' });
  }

  let payload;

  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    res.status(UnauthorizedError)
      .json({ message: 'Ошибка авторизации' });
  }

  req.user = { _id: payload._id };

  next();
};
