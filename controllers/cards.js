const Card = require('../models/card');
const BadRequestError = require('../errors/badRequestError');
const { InternalServerError } = require('../errors/serverError');
const NotFoundError = require('../errors/notFoundError');

module.exports.createCard = (req, res) => {
  const {
    name,
    link,
  } = req.body;
  const ownerId = req.user._id;
  Card.create({
    name,
    link,
    owner: ownerId,
  })
    .then((card) => res.status(201)
      .json(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BadRequestError)
          .json({ message: 'Неправильные данные введены' });
      } else {
        res.status(InternalServerError)
          .json({ message: 'Произошла ошибка загрузки данных' });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find(req.query)
    .then((cards) => res.status(200)
      .json(cards))
    .catch(() => res.status(InternalServerError)
      .json({ message: 'Произошла ошибка загрузки данных' }));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (card) {
        res.status(200)
          .json({ message: 'Успешно удален' });
      } else {
        res.status(NotFoundError)
          .json({
            message: 'Карточка не найдена',
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BadRequestError)
          .json({ message: 'Неправильные данные введены' });
      } else {
        res.status(InternalServerError)
          .json({ message: 'Произошла ошибка загрузки данных' });
      }
    });
};

module.exports.putLikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .then((card) => {
      if (card) {
        res.status(200)
          .json(card);
      } else {
        res.status(NotFoundError)
          .json({
            message: 'Resource not found',
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BadRequestError)
          .json({ message: 'Неправильные данные введены' });
      } else {
        res.status(InternalServerError)
          .json({ message: 'Произошла ошибка загрузки данных' });
      }
    });
};

module.exports.putDislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .then((card) => {
      if (card) {
        res.status(200)
          .json(card);
      } else {
        res.status(NotFoundError)
          .json({
            message: 'Resource not found',
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BadRequestError)
          .json({ message: 'Неправильные данные введены' });
      } else {
        res.status(InternalServerError)
          .json({ message: 'Произошла ошибка загрузки данных' });
      }
    });
};
