const jwt = require('jsonwebtoken');
const { tokenKey } = require('../helpers/token');
const UnauthorizedError = require('../errors/unauthorizedError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    if (!req.cookies) {
      res.status(UnauthorizedError)
        .json({ message: 'Необходима авторизация' });
    }

    try {
      payload = jwt.verify(token, tokenKey);
    } catch (err) {
      res.status(UnauthorizedError)
        .json({ message: 'Необходима авторизация' });
    }

    req.user = payload;
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  auth,
};
