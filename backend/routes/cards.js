const router = require('express').Router();
const {
  getCards,
  createCard,
  updateCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const {
  validateNewCard,
  validateCardChanges,
  validateCardId,
} = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', validateNewCard, createCard);
router.patch('/:cardId', validateCardId, validateCardChanges, updateCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = router;
