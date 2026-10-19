const jwt = require('jsonwebtoken');
const { ForbiddenError, UnauthorizedError } = require('../errors/http-errors');
const { JWT_SECRET } = require('../utils/config');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new ForbiddenError('Autorização necessária'));
    return;
  }

  const token = authorization.replace('Bearer ', '');

  try {
    req.user = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError('Token inválido ou expirado'));
    return;
  }

  next();
};
