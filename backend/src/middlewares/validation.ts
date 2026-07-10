import { celebrate, Joi } from 'celebrate';

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