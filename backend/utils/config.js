require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

// Em produção o JWT_SECRET deve vir do arquivo .env do servidor.
// Em desenvolvimento, um valor padrão permite rodar sem o arquivo .env.
const { JWT_SECRET = 'dev-secret' } = process.env;

if (isProduction && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET não foi definido no ambiente de produção');
}

const {
  PORT = 3001,
  MONGO_URI = 'mongodb://localhost:27017/aroundb',
} = process.env;

module.exports = {
  isProduction,
  JWT_SECRET,
  PORT,
  MONGO_URI,
};
