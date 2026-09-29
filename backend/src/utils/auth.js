const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || '7d'
  });
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

exports.generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

exports.generatePasswordResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

exports.hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
