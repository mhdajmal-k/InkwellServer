import Joi from "joi";

export const blogValidatorSchema = Joi.object({
  title: Joi.string().trim().min(4).max(100).required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title is required",
    "string.min": "Title must be at least 4 characters long",
    "string.max": "Title cannot exceed 100 characters",
    "string.trim": "Title must not have leading or trailing spaces",
  }),
  content: Joi.string().trim().min(10).max(10000).required().messages({
    "string.base": "content must be a string",
    "string.empty": "content is required",
    "string.min": "content must be at least 10 characters long",
    "string.max": "content cannot exceed 500 characters",
    "string.trim": "content must not have leading or trailing spaces",
  }),
  category: Joi.string().required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title is required",
  }),
  image: Joi.any(),
});
