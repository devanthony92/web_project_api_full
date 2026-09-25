const { isCelebrateError } = require('celebrate');
const { DEFAULT_ERROR, DEFAULT_ERROR_MESSAGE } = require('../utils/errors');
const { BadRequestError, ConflictError } = require('../errors');

const normalizeError = (err) => {
  const isInvalidData = isCelebrateError(err)
    || err.name === 'ValidationError'
    || err.name === 'CastError'
    || err.type === 'entity.parse.failed';

  if (isInvalidData) {
    return new BadRequestError('Se enviaron datos inválidos');
  }
  if (err.code === 11000) {
    return new ConflictError('Ya existe un usuario con ese correo electrónico');
  }
  return err;
};

// El parámetro next es obligatorio para que Express reconozca el middleware de errores
module.exports = (err, req, res, next) => {
  const { statusCode = DEFAULT_ERROR, message } = normalizeError(err);

  res.status(statusCode).send({
    message: statusCode === DEFAULT_ERROR ? DEFAULT_ERROR_MESSAGE : message,
  });
};
