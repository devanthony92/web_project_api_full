const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const { UnauthorizedError } = require('../errors');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Se requiere autorización'));
  }

  const token = authorization.replace('Bearer ', '');

  try {
    req.user = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Se requiere autorización'));
  }

  return next();
};
