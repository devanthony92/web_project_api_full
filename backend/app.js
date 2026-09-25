const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { validateSignup, validateSignin } = require('./middlewares/validation');
const { NotFoundError } = require('./errors');

const app = express();
const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/aroundb' } = process.env;

mongoose.connect(MONGO_URL);

app.use(cors());
app.options('/{*splat}', cors());

app.use(express.json());

app.use(requestLogger);

// Ruta temporal para la prueba de caída del servidor; eliminar tras la revisión
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('El servidor va a caer');
  }, 0);
});

app.post('/signin', validateSignin, login);
app.post('/signup', validateSignup, createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req, res, next) => next(new NotFoundError('Recurso solicitado no encontrado')));

app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
