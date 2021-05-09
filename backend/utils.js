const Joi = require("joi");

const commenValidatorSchema = Joi.object({
  comment: Joi.string().regex(/^[a-zA-Z0-9 ,().]{1,500}$/),
});

const userLoginValidatorSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(32).required(),
});

const userRegistrationValidation = Joi.object({
  email: Joi.string()
    .email()
    .regex(/@g.bracu.ac.bd$/),
  password: Joi.string().min(6).max(32).required(),
  passwordConfirm: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .messages({ "any.only": "{{#label}} does not match" }),
});

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

module.exports.validateComment = (cmnt) => {
  return commenValidatorSchema.validate({
    comment: cmnt,
  });
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
