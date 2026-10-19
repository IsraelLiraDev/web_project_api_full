const Card = require('../models/card');
const { ForbiddenError, NotFoundError } = require('../errors/http-errors');

const cardNotFound = () => new NotFoundError('Cartão não encontrado');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .sort({ createdAt: -1 })
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(cardNotFound())
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Você não pode excluir o cartão de outro usuário');
      }

      return card.deleteOne().then(() => res.send(card));
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(cardNotFound())
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(cardNotFound())
    .then((card) => res.send(card))
    .catch(next);
};
