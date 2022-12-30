const Card = require('../models/card');

module.exports.createCard = (req, res, next) => {
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
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400)
          .json({ message: 'Неправильные данные введены' });
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find(req.query)
    .then((cards) => res.status(200)
      .json(cards))
    .catch((err) => {
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  const userId = req.user._id;

  Card.findById({ _id: cardId })
    .then((card) => {
      if (!card) {
        res.status(404)
          .json({
            message: 'Карточка не найдена',
          });
      }
      if (userId === card.owner.toString()) {
        card.remove();
      } else {
        res.status(403).json({ message: 'Доступ запрещен' });
      }
    })
    .catch((err) => {
      next(err);
    });

  Card.findByIdAndRemove(cardId)
    .then(() => {
      res.status(200)
        .json({ message: 'Успешно удален' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400)
          .json({ message: 'Неправильные данные введены' });
      } else {
        next(err);
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
        res.status(404)
          .json({
            message: 'Resource not found',
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400)
          .json({ message: 'Неправильные данные введены' });
      } else {
        res.status(500)
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
        res.status(404)
          .json({
            message: 'Resource not found',
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400)
          .json({ message: 'Неправильные данные введены' });
      } else {
        res.status(500)
          .json({ message: 'Произошла ошибка загрузки данных' });
      }
    });
};
