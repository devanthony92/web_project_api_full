const mongoose = require('mongoose');
const validator = require('validator');

const DEFAULT_AVATAR = 'https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 40,
    default: 'Jacques Cousteau',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 100,
    default: 'Explorador',
  },
  avatar: {
    type: String,
    default: DEFAULT_AVATAR,
    validate: {
      validator: (value) => validator.isURL(value),
      message: 'La URL del avatar no es válida',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'El correo electrónico no es válido',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
