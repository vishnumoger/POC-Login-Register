'use strict';

const Joi = require('joi');

const registerSchema = Joi.object({
  firstName: Joi.string().required().messages({
    'string.base': `"firstName" should be a type of 'text'`,
    'string.empty': `"firstName" cannot be an empty field`,
    'any.required': `"firstName" is a required field`
  }),
  lastName: Joi.string().required().messages({
    'string.base': `"lastName" should be a type of 'text'`,
    'string.empty': `"lastName" cannot be an empty field`,
    'any.required': `"lastName" is a required field`
  }),
  phone: Joi.string().required().messages({
    'string.base': `"phone" should be a type of 'text'`,
    'string.empty': `"phone" cannot be an empty field`,
    'any.required': `"phone" is a required field`
  }),
  country: Joi.string().required().messages({
    'string.base': `"country" should be a type of 'text'`,
    'string.empty': `"country" cannot be an empty field`,
    'any.required': `"country" is a required field`
  }),
  email: Joi.string().email().required().messages({
    'string.base': `"email" should be a type of 'text'`,
    'string.empty': `"email" cannot be an empty field`,
    'string.email': `"email" should be a valid email address`,
    'any.required': `"email" is a required field`
  }),
  password: Joi.string().required().messages({
    'string.base': `"password" should be a type of 'text'`,
    'string.empty': `"password" cannot be an empty field`,
    'any.required': `"password" is a required field`
  }),
  role: Joi.string().required().messages({
    'string.base': `"role" should be a type of 'text'`,
    'string.empty': `"role" cannot be an empty field`,
    'any.required': `"role" is a required field`
  }),
  token: Joi.string().valid('tV-Weq:3AEwZVjs').required().messages({
    'any.required': 'token is required',
    'any.only': 'token is not valid',
  }),
});

const userSignupSchema = Joi.object({
  agency_name: Joi.string().required().messages({
    'string.base': `"agency_name" should be a type of 'text'`,
    'string.empty': `"agency_name" cannot be an empty field`,
    'any.required': `"agency_name" is a required field`
  }),
  username: Joi.string().required().messages({
    'string.base': `"username" should be a type of 'text'`,
    'string.empty': `"username" cannot be an empty field`,
    'any.required': `"username" is a required field`
  }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'any.required': 'password is required',
      'string.min': 'password must have at least 6 characters',
    }),
});

const loginSchema = Joi.object({
    username: Joi.string().required().messages({
        'string.base': `"username" should be a type of 'text'`,
        'string.empty': `"username" cannot be an empty field`,
        'any.required': `"username" is a required field`
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'any.required': 'password is required',
      'string.min': 'password must have at least 8 characters',
    }),
});

const forgetEmailSchema = Joi.object({
  email: Joi.string()
    .regex(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    .required()
    .messages({
      'any.required': 'email is required',
      'string.pattern.base': 'email is not valid',
    }),
});

module.exports = { registerSchema, userSignupSchema, loginSchema, forgetEmailSchema };
