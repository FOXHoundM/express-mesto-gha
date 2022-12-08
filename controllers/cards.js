const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  console.log(req.user._id);// _id станет доступен
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
    .then((card) => res.status(200)
      .json(card))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400)
          .json({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500)
          .json({ message: err.message });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find(req.query)
    .then((cards) => res.status(200)
      .json(cards))
    .catch((err) => res.status(500)
      .json({ err: err.message }));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (card) {
        res.status(200)
          .json({ message: 'Card deleted successfully' });
      } else {
        res.status(404)
          .json({ message: 'Card not found' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400)
          .json({ message: 'Incorrect data entered' });
      } else {
        res.status(500)
          .json({ message: err.message });
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
      runValidators: true,
    },
  )
    .then((card) => {
      if (card) {
        res.status(200)
          .json(card);
      } else {
        res.status(404)
          .json({ message: 'Card not found' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400)
          .json({ message: 'Incorrect data entered' });
      } else {
        res.status(500)
          .json({ message: err.message });
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
      runValidators: true,
    },
  )
    .then((card) => {
      if (card) {
        res.status(200)
          .json(card);
      } else {
        res.status(404)
          .json({ message: 'Card not found' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400)
          .json({ message: 'Incorrect data entered' });
      } else {
        res.status(500)
          .json({ message: err.message });
      }
    });
};
