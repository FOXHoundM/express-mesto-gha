const jwt = require('jsonwebtoken');
const { secretKey } = require('../helpers/token');

// const UnauthorizedError = require('../errors/unauthorizedError');

const handleAuthError = (res) => {
  res
    .status(401)
    .json({ message: 'Необходима авторизация' });
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  return next();
};
