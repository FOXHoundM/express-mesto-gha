const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {
  errors,
  celebrate,
  Joi,
} = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const {
  login,
  createUser,
} = require('./controllers/users');
const { errorHandler } = require('./helpers/errorHandler');
const { isUrlValid } = require('./helpers/isUrlValid');
const {
  requestLogger,
  errorLogger,
} = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

const allowedCors = [
  'http://localhost:3000',
  'http://foxhound.nomoredomains.club',
  'https://foxhound.nomoredomains.club',
];

const corsOptions = {
  origin: allowedCors,
  optionSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

app.post('/signin', celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required(),
    }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required(),
      name: Joi.string()
        .min(2)
        .max(30),
      about: Joi.string()
        .min(2)
        .max(30),
      avatar: Joi.string()
        .custom(isUrlValid),
    }),
}), createUser);

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);

app.use(errorLogger);

app.use('*', (req, res) => res.status(404)
  .json({ message: 'Произошла ошибка, передан некорректный путь' }));

app.use(errors());
app.use(errorHandler);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}, () => {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`App listening on port ${PORT}`);
  });
});
