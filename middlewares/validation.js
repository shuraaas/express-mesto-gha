import { celebrate, Joi } from 'celebrate';
import validator from 'validator';

const validateRegisterBody = celebrate({
  body: {
    email: Joi.string().required().email().messages({
      'any.required': 'Поле email обязательно',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Поле password обязательно',
    }),
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимальная длина поля 2 символа',
      'string.max': 'Максимальная длина поля 30 символов',
    }),
    about: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимальная длина поля 2 символа',
      'string.max': 'Максимальная длина поля 30 символов',
    }),
    avatar: Joi.string().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Не валидная ссылка');
    }).messages({
      'any.required': 'Поле link обязательно',
    }),
  },
});

const validateAuthBody = celebrate({
  body: {
    email: Joi.string().required().email().messages({
      'any.required': 'Поле email обязательно',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Поле password обязательно',
    }),
  },
});

const validateCardBody = celebrate({
  body: {
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимальная длина поля 2 символа',
        'string.max': 'Максимальная длина поля 30 символов',
        'any.required': 'Поле name обязательно',
      }),
    link: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Не валидная ссылка');
    }).messages({
      'any.required': 'Поле link обязательно',
    }),
  },
});

const validateAvatarBody = celebrate({
  body: {
    avatar: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Не валидная ссылка');
    }).messages({
      'any.required': 'Поле link обязательно',
    }),
  },
});

const validateUserId = celebrate({
  params: {
    userId: Joi.string().required().custom((value, helpers) => {
      if (validator.isMongoId(value)) {
        return value;
      }
      return helpers.message('ID должен быть строкой из 24 шестнадцатеричных символов или целым числом');
    }),
  },
});

const validateCardId = celebrate({
  params: {
    cardId: Joi.string().required().custom((value, helpers) => {
      if (validator.isMongoId(value)) {
        return value;
      }
      return helpers.message('ID должен быть строкой из 24 шестнадцатеричных символов или целым числом');
    }),
  },
});

const validateUpdateUser = celebrate({
  body: {
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимальная длина поля 2 символа',
        'string.max': 'Максимальная длина поля 30 символов',
      }),
    about: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимальная длина поля 2 символа',
        'string.max': 'Максимальная длина поля 30 символов',
      }),
  },
});

export {
  validateRegisterBody,
  validateAuthBody,
  validateCardBody,
  validateAvatarBody,
  validateUserId,
  validateUpdateUser,
  validateCardId,
};
