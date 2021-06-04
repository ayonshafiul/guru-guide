const Joi = require("joi");

module.exports.createSuccessObject = (msg) => {
  return {
    success: true,
    message: msg,
  };
};

module.exports.createSuccessObjectWithData = (data) => {
  return {
    success: true,
    data: data,
  };
};

module.exports.createErrorObject = (msg) => {
  return {
    success: false,
    message: msg,
  };
};
module.exports.validateEmail = (email) => {
  return Joi.string()
    .regex(/@g.bracu.ac.bd$/)
    .validate(email);
};

module.exports.validateComment = (cmnt) => {
  return Joi.string()
    .regex(/^[a-zA-Z0-9 ,.()?:-_'"!]{2,300}$/)
    .validate(cmnt);
};

module.exports.validateComplaint = (complaint) => {
  return Joi.string()
    .regex(/^[a-zA-Z0-9 ,.()?:-_'"!]{10,310}$/)
    .validate(complaint);
};

module.exports.validateNumber = (num) => {
  return Joi.number().integer().validate(num);
};

module.exports.validateCharactersOnly = (str) => {
  return Joi.string()
    .regex(/^[a-zA-Z]*$/)
    .validate(str);
};

module.exports.validateCharactersOnlyWithSpaces = (str) => {
  return Joi.string()
    .regex(/^[a-zA-Z ]*$/)
    .validate(str);
};

module.exports.validateAlphaNumeric = (str) => {
  return Joi.string().alphanum().validate(str);
};

module.exports.validateUserRegistration = (userObject) => {
  return userRegistrationValidation.validate(userObject);
};
