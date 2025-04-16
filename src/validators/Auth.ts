import { Joi } from 'express-validation';

export default {
  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
  verifyInviteAccount: {
    body: Joi.object({
      username: Joi.string().max(50).required(),
      password: Joi.string().min(6).max(200).required(),
      confirmationPassword: Joi.ref('password'),
      token: Joi.string().required(),
    }),
  },
  signUp: {
    body: Joi.object({
      email: Joi.string().email().max(50).required(),
      username: Joi.string().max(50).required(),
      password: Joi.string().min(6).max(200).required(),
      confirmationPassword: Joi.ref('password'),
    }),
  },
  sendVerifyMail: {
    body: Joi.object({
      email: Joi.string().email().max(50).required(),
    }),
  },
  verifyAccount: {
    body: Joi.object({
      token: Joi.string().required(),
    }),
  },
  inviteUser: {
    body: Joi.object({
      email: Joi.string().email().max(50).required(),
      role: Joi.string().valid('admin', 'manager', 'lead', 'designer', 'tester', 'read_only', 'no_access').required(),
    }),
  },
  requestResetPassword: {
    body: Joi.object({
      email: Joi.string().email().max(50).required(),
    }),
  },
  resetPassword: {
    body: Joi.object({
      token: Joi.string().required(),
      password: Joi.string().min(6).max(200).required(),
      confirmationPassword: Joi.ref('password'),
    }),
  },
};
