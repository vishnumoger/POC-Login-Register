'use strict';

const jwt = require('jsonwebtoken');
const config = require('config');

const secret = config.jwt;

const sign = (payload) => {
  return jwt.sign(payload, secret);
};

const signWithOptions = (payload, options) => {
  return jwt.sign(payload, secret, options);
};

const verify = (token) => {
  return jwt.verify(token, secret);
};

const getUserId = (token) => {
  const decoded = verify(token.replace('Bearer ', ''));
  if (decoded) {
    return decoded;
  } else {
    return 'invalid user';
  }
};

module.exports = {
  sign,
  signWithOptions,
  verify,
  getUserId,
};
