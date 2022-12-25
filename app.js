const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { auth } = require('./middlewares/auth');
const { STATUS_NOT_FOUND } = require('./errors/errors');
const {
  login,
  createUser,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use(auth);

app.use('*', (req, res) => res.status(STATUS_NOT_FOUND)
  .json({ message: 'Произошла ошибка, передан некорректный путь' }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}, () => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
});
