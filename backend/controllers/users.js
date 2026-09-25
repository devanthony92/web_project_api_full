const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../utils/config');
const { NotFoundError, UnauthorizedError } = require('../errors');

const userNotFound = () => new NotFoundError('No se encontró ningún usuario con ese id');

module.exports.getUsers = (req, res, next) => User.find({})
  .then((users) => res.send(users))
  .catch(next);

module.exports.getCurrentUser = (req, res, next) => User.findById(req.user._id)
  .orFail(userNotFound)
  .then((user) => res.send(user))
  .catch(next);

module.exports.getUserById = (req, res, next) => User.findById(req.params.userId)
  .orFail(userNotFound)
  .then((user) => res.send(user))
  .catch(next);

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      const userData = user.toObject();
      delete userData.password;
      return res.status(201).send(userData);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const invalidCredentials = () => new UnauthorizedError('Correo electrónico o contraseña incorrectos');

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw invalidCredentials();
      }
      return bcrypt.compare(password, user.password).then((matches) => {
        if (!matches) {
          throw invalidCredentials();
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        return res.send({ token });
      });
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { returnDocument: 'after', runValidators: true },
  )
    .orFail(userNotFound)
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { returnDocument: 'after', runValidators: true },
  )
    .orFail(userNotFound)
    .then((user) => res.send(user))
    .catch(next);
};
