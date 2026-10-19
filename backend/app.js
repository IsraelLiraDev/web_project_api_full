const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { PORT, MONGO_URI } = require('./utils/config');
const { createUser, login } = require('./controllers/users');
const { validateSignup, validateSignin } = require('./middlewares/validation');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { NotFoundError } = require('./errors/http-errors');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();

mongoose.connect(MONGO_URI);

app.use(requestLogger);

// Habilita CORS e as solicitações preflight para todas as rotas.
app.use(cors());
app.options('/{*splat}', cors());

app.use(express.json());

// Rota de teste de falha: o PM2 deve reiniciar o servidor depois dela.
// Remover depois da revisão do projeto.
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('O servidor travará agora');
  }, 0);
});

app.post('/signin', validateSignin, login);
app.post('/signup', validateSignup, createUser);

// Todas as rotas abaixo exigem autorização.
app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req, res, next) => {
  next(new NotFoundError('A solicitação não foi encontrada'));
});

app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
