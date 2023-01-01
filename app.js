const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const {
  login,
  createUser,
} = require('./controllers/users');
const { errorHandler } = require('./helpers/errorHandler');
const {
  validateSignIn,
  validateSignUp,
} = require('./middlewares/validator');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signin', validateSignIn, login);
app.post('/signup', validateSignUp, createUser);

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);

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
