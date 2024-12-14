import Joi from "joi";

export const signUpValidatorSchema = Joi.object({
  firstName: Joi.string().trim().min(3).max(20).required().messages({
    "string.base": "Username must be a string",
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username cannot exceed 30 characters",
    "string.trim": "Username must not have leading or trailing spaces",
  }),
  lastName: Joi.string().trim().min(3).max(20).required().messages({
    "string.base": "Username must be a string",
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username cannot exceed 30 characters",
    "string.trim": "Username must not have leading or trailing spaces",
  }),
  email: Joi.string().trim().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
    "string.trim": "Email must not have leading or trailing spaces",
  }),
  phone: Joi.string()
    .trim()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number must be exactly 10 digits",
    }),
  dob: Joi.date().iso().less("now").required().messages({
    "date.base": "Date of birth must be a valid date",
    "date.less": "Date of birth must be in the past",
  }),
  password: Joi.string().trim().min(6).max(128).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.max": "Password cannot exceed 128 characters",
    "string.empty": "Password is required",
    "string.trim": "Password must not have leading or trailing spaces",
  }),

  articlePreferences: Joi.array().min(3).required().messages({
    "array.base": "Article preferences must be an array",
    "array.min": "At least one article preference is required",
  }),
});
