require('dotenv').config({ quiet: true });

const { NODE_ENV, JWT_SECRET } = process.env;

if (NODE_ENV === 'production' && !JWT_SECRET) {
  throw new Error('JWT_SECRET es obligatorio en producción');
}

module.exports = {
  JWT_SECRET: NODE_ENV === 'production' ? JWT_SECRET : 'clave-secreta-de-desarrollo',
};
