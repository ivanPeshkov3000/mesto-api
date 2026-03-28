import { celebrate, Joi } from 'celebrate';

const createUser = celebrate({
  body: Joi.object().required().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
    avatar: Joi.string().required().min(2),
    email: Joi.string().required().min(2),
    password: Joi.string().required().min(2),
  }),
  query: Joi.object().max(0),
});

const login = celebrate({
  body: Joi.object().required().keys({
    email: Joi.string().required().min(2),
    password: Joi.string().required().min(2),
  }),
  query: Joi.object().max(0),
});

const getUser = celebrate({
  query: Joi.object().max(0),
});

const getUsers = celebrate({
  query: Joi.object().max(0),
});

const updateUser = celebrate({
  body: Joi.object().required().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().min(2),
    email: Joi.string().min(2),
    password: Joi.string().min(2),
  }),
});

const deleteUser = celebrate({
  query: Joi.object().max(0),
  body: Joi.object().max(0),
});

const updateAvatar = celebrate({
  body: Joi.object().required().keys({
    title: Joi.string().required().min(2).max(30),
    text: Joi.string().required().min(2),
  }),
});

// Cards
const getCards = celebrate({
  body: Joi.object().required().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().uri().required(),
  }),
});

const likeCard = celebrate({
  body: Joi.object().required().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().uri().required(),
  }),
});

const dislikeCard = celebrate({
  body: Joi.object().required().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().uri().required(),
  }),
});

const createCard = celebrate({
  body: Joi.object().required().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().uri().required(),
  }),
});

const deleteCard = celebrate({
  body: Joi.object().required().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().uri().required(),
  }),
});

export default {
  createUser,
  login,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  updateAvatar,
  getCards,
  likeCard,
  dislikeCard,
  createCard,
  deleteCard,
};
