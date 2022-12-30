const router = require('express')
  .Router();

const {
  getCards,
  createCard,
  deleteCard,
  putLikeCard,
  putDislikeCard,
} = require('../controllers/cards');
const { validateCardCreation, validateCardId } = require('../middlewares/validator');

router.get('/', getCards);
router.post('/', validateCardCreation, createCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, putLikeCard);
router.delete('/:cardId/likes', validateCardId, putDislikeCard);

module.exports = router;
