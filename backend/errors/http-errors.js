/* eslint-disable max-classes-per-file */
class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

class BadRequestError extends HttpError {
  constructor(message = 'Dados inválidos') {
    super(400, message);
  }
}

class UnauthorizedError extends HttpError {
  constructor(message = 'Token inválido ou e-mail e senha incorretos') {
    super(401, message);
  }
}

class ForbiddenError extends HttpError {
  constructor(message = 'Acesso negado') {
    super(403, message);
  }
}

class NotFoundError extends HttpError {
  constructor(message = 'Recurso não encontrado') {
    super(404, message);
  }
}

class ConflictError extends HttpError {
  constructor(message = 'Conflito com um recurso existente') {
    super(409, message);
  }
}

module.exports = {
  HttpError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
