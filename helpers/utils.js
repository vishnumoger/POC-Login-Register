'use strict';

const HTTPStatus = require('http-status');
const { default: mongoose } = require('mongoose');

const sendResponse = (res, data = {}, statusCode = HTTPStatus.OK, message = 'success') => {
  res.setHeader('Content-Type', 'application/json');
  res.status(statusCode).json({
    statusCode,
    message,
    data,
  });
};

const sendAuthError = (res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(HTTPStatus.UNAUTHORIZED).json({
    statusCode: HTTPStatus.UNAUTHORIZED,
    message: 'Unauthorized',
  });
};

const sendError = (
  res,
  data = {},
  statusCode = HTTPStatus.BAD_REQUEST,
  message = 'Bad Request'
) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(statusCode).json({
    statusCode,
    message,
    data,
  });
};

const getBearerToken = (req) => {
  return req.header('Authorization')?.split(' ')[1];
};

const getId = (id) => {
  return new mongoose.Types.ObjectId(id);
};

module.exports = { sendResponse, sendAuthError, sendError, getBearerToken, getId };
