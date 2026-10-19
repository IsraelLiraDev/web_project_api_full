const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }

  return helpers.error('string.uri');
};

const objectId = Joi.string().hex().length(24);

const authBody = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

// Em Express 5, req.body é undefined sem corpo; .required() devolve 400 nesses casos.

module.exports.validateSignup = celebrate({
  body: authBody.keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
  }).required(),
});

module.exports.validateSignin = celebrate({
  body: authBody.required(),
});

module.exports.validateUserId = celebrate({
  params: Joi.object().keys({
    userId: objectId.required(),
  }),
});

module.exports.validateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }).required(),
});

module.exports.validateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateURL),
  }).required(),
});

module.exports.validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validateURL),
  }).required(),
});

module.exports.validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: objectId.required(),
  }),
});
