const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const isURL = require('validator/lib/isURL');
const bcrypt = require('bcrypt');
const UnauthorizedError = require('../errors/unauthorizedError');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      minLength: 2,
      maxLength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minLength: 2,
      maxLength: 30,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      validate: {
        validator: (v) => isURL(v),
        message: 'Please enter a valid URL address',
      },
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: (v) => isEmail(v),
        message: 'Please enter a valid email address',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
