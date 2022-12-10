const Card = require('../models/card');
const {
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  BAD_REQUEST_MESSAGE,
  STATUS_ERROR,
  ERROR_MESSAGE,
  STATUS_SUCCESS,
  DELETE_MESSAGE,
  STATUS_NOT_FOUND,
  NOT_FOUND_MESSAGE,
} = require('../errors/errors');

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
    .then((card) => res.status(STATUS_CREATED)
      .json(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST)
          .json({ message: BAD_REQUEST_MESSAGE });
      } else {
        res.status(STATUS_ERROR)
          .json({ message: ERROR_MESSAGE });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find(req.query)
    .then((cards) => res.status(STATUS_SUCCESS)
      .json(cards))
    .catch(() => res.status(STATUS_SUCCESS)
      .json({ message: ERROR_MESSAGE }));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (card) {
        res.status(STATUS_SUCCESS)
          .json({ message: DELETE_MESSAGE });
      } else {
        res.status(STATUS_NOT_FOUND)
          .json({ message: NOT_FOUND_MESSAGE });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST)
          .json({ message: BAD_REQUEST_MESSAGE });
      } else {
        res.status(STATUS_ERROR)
          .json({ message: ERROR_MESSAGE });
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
        res.status(STATUS_SUCCESS)
          .json(card);
      } else {
        res.status(STATUS_NOT_FOUND)
          .json({ message: NOT_FOUND_MESSAGE });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST)
          .json({ message: BAD_REQUEST_MESSAGE });
      } else {
        res.status(STATUS_ERROR)
          .json({ message: ERROR_MESSAGE });
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
        res.status(STATUS_SUCCESS)
          .json(card);
      } else {
        res.status(STATUS_NOT_FOUND)
          .json({ message: NOT_FOUND_MESSAGE });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST)
          .json({ message: BAD_REQUEST_MESSAGE });
      } else {
        res.status(STATUS_ERROR)
          .json({ message: ERROR_MESSAGE });
      }
    });
};
