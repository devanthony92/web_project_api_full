const Card = require('../models/card');
const { ForbiddenError, NotFoundError } = require('../errors');

const cardNotFound = () => new NotFoundError('No se encontró ninguna tarjeta con ese id');

module.exports.getCards = (req, res, next) => Card.find({})
  .then((cards) => res.send(cards))
  .catch(next);

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch(next);
};

// Busca la tarjeta y comprueba que pertenece al usuario que hace la solicitud
const findOwnedCard = (req, action) => Card.findById(req.params.cardId)
  .orFail(cardNotFound)
  .then((card) => {
    if (card.owner.toString() !== req.user._id) {
      throw new ForbiddenError(`No puedes ${action} una tarjeta de otro usuario`);
    }
    return card;
  });

module.exports.updateCard = (req, res, next) => {
  const { name, link } = req.body;

  return findOwnedCard(req, 'editar')
    .then((card) => {
      Object.assign(card, { name, link });
      return card.save();
    })
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => findOwnedCard(req, 'eliminar')
  .then((card) => card.deleteOne().then(() => res.send(card)))
  .catch(next);

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { returnDocument: 'after' },
)
  .orFail(cardNotFound)
  .then((card) => res.send(card))
  .catch(next);

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { returnDocument: 'after' },
)
  .orFail(cardNotFound)
  .then((card) => res.send(card))
  .catch(next);
