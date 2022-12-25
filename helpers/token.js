const jwt = require('jsonwebtoken');

const secretKey = 'secret-key';

const generateToken = (payload) => jwt.sign(payload, secretKey, { expiresIn: '7d' });

module.exports = {
  secretKey,
  generateToken,
};
