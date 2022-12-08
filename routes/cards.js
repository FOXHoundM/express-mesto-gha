const router = require('express')
  .Router();

const {
  getCards,
  createCard,
  deleteCard,
  putLikeCard,
  putDislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', putLikeCard);
router.delete('/:cardId/likes', putDislikeCard);

module.exports = router;
