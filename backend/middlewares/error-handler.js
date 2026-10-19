const { isCelebrateError } = require('celebrate');

const SERVER_ERROR_MESSAGE = 'Ocorreu um erro no servidor';

// Traduz qualquer erro (próprio, do Mongoose ou do celebrate) para
// { statusCode, message }. A resposta enviada ao cliente tem só o campo message.
const normalizeError = (err) => {
  if (isCelebrateError(err)) {
    const [segment] = err.details.values();
    return { statusCode: 400, message: segment.details[0].message };
  }

  if (err.name === 'ValidationError') {
    return { statusCode: 400, message: err.message };
  }

  if (err.name === 'CastError') {
    return { statusCode: 400, message: 'O identificador informado é inválido' };
  }

  if (err.code === 11000) {
    return { statusCode: 409, message: 'Já existe um usuário com este e-mail' };
  }

  if (err.statusCode) {
    return { statusCode: err.statusCode, message: err.message };
  }

  return { statusCode: 500, message: SERVER_ERROR_MESSAGE };
};

// O parâmetro next precisa existir para o Express reconhecer o middleware de erros.
module.exports = (err, req, res, next) => {
  const { statusCode, message } = normalizeError(err);

  res.status(statusCode).send({
    message: statusCode === 500 ? SERVER_ERROR_MESSAGE : message,
  });
};
