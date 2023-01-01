const router = require('express')
  .Router();

const {
  getCards,
  createCard,
  deleteCard,
  putLikeCard,
  putDislikeCard,
} = require('../controllers/cards');
const {
  validatePostCard,
  validateDeleteCardId,
  validatePutLike,
  validateDeleteLike,
} = require('../middlewares/validator');

router.get('/', getCards);
router.post('/', validatePostCard, createCard);
router.delete('/:cardId', validateDeleteCardId, deleteCard);
router.put('/:cardId/likes', validatePutLike, putLikeCard);
router.delete('/:cardId/likes', validateDeleteLike, putDislikeCard);

module.exports = router;
