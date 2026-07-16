import { celebrate, Joi, Segments } from 'celebrate';

export const validateCreateProduct = celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "title" - 2',
        'string.max': 'Максимальная длина поля "title" - 30',
        'any.required': 'Поле "title" должно быть заполнено',
      }),
    image: Joi.object().keys({
      fileName: Joi.string().required(),
      originalName: Joi.string().required(),
    }).required().messages({
      'any.required': 'Поле "image" должно быть заполнено',
    }),
    category: Joi.string().required().messages({
      'any.required': 'Поле "category" должно быть заполнено',
    }),
    description: Joi.string(),
    price: Joi.number().allow(null),
  }),
});

export const validateUpdateProduct = celebrate({
  params: Joi.object().keys({
    productId: Joi.string().length(24).hex().required()
      .messages({
        'string.length': 'productId должен быть 24-символьной hex-строкой',
        'string.hex': 'productId должен быть hex-строкой',
        'any.required': 'productId обязателен',
      }),
  }),
  body: Joi.object().keys({
    title: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "title" - 2',
        'string.max': 'Максимальная длина поля "title" - 30',
      }),
    image: Joi.object().keys({
      fileName: Joi.string().required(),
      originalName: Joi.string().required(),
    }),
    category: Joi.string(),
    description: Joi.string(),
    price: Joi.number().allow(null),
  }),
});

export const validateProductId = celebrate({
  params: Joi.object().keys({
    productId: Joi.string().length(24).hex().required()
      .messages({
        'string.length': 'productId должен быть 24-символьной hex-строкой',
        'string.hex': 'productId должен быть hex-строкой',
        'any.required': 'productId обязателен',
      }),
  }),
});

export const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      'any.required': 'Поле "email" должно быть заполнено',
      'string.email': 'Некорректный email',
    }),
    password: Joi.string().required().min(6).messages({
      'any.required': 'Поле "password" должно быть заполнено',
      'string.min': 'Пароль должен содержать минимум 6 символов',
    }),
  }),
});

export const validateRegister = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email().required().messages({
      'any.required': 'Поле "email" должно быть заполнено',
      'string.email': 'Некорректный email',
    }),
    password: Joi.string().required().min(6).messages({
      'any.required': 'Поле "password" должно быть заполнено',
      'string.min': 'Пароль должен содержать минимум 6 символов',
    }),
  }),
});

export const validateRefreshToken = celebrate({
  cookies: Joi.object().keys({
    refreshToken: Joi.string().required().messages({
      'any.required': 'refreshToken не найден в cookies',
    }),
  }),
});

export const validateLogout = celebrate({
  cookies: Joi.object().keys({
    refreshToken: Joi.string().required().messages({
      'any.required': 'refreshToken не найден в cookies',
    }),
  }),
});

export const validateCreateOrder = celebrate({
  body: Joi.object().keys({
    payment: Joi.string().valid('card', 'online').required().messages({
      'any.required': 'Поле "payment" должно быть заполнено',
      'any.only': 'payment должен быть card или online',
    }),
    email: Joi.string().email().required().messages({
      'any.required': 'Поле "email" должно быть заполнено',
      'string.email': 'Некорректный email',
    }),
    phone: Joi.string().required().messages({
      'any.required': 'Поле "phone" должно быть заполнено',
    }),
    address: Joi.string().required().messages({
      'any.required': 'Поле "address" должно быть заполнено',
    }),
    total: Joi.number().required().messages({
      'any.required': 'Поле "total" должно быть заполнено',
    }),
    items: Joi.array().items(Joi.string()).min(1).required().messages({
      'any.required': 'Поле "items" должно быть заполнено',
      'array.min': 'items должен быть непустым массивом',
    }),
  }),
});