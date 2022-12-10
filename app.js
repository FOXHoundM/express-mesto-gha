const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6390a730d6ca7045a6de4b2f',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res) => res.status(404)
  .json({ message: 'Произошла ошибка, передан некорректный путь' }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}, () => {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`App listening on port ${PORT}`);
  });
});
