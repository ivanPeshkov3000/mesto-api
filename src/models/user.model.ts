import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import isEmail from 'validator/lib/isEmail';

import { IUser, UserModel } from '../utils/types';
import HttpError from '../utils/errors/httpError';
import { HttpStatus } from '../utils/httpStatuses';

const userSchema = new Schema<IUser, UserModel>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return /^https?:\/\/(www\.)?[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?#?$/.test(v);
      },
      message: (props) => `${props.value} не является валидной ссылкой!`,
    },
  },
  email: {
    type: String,
    required: [true, 'Email обязателен'],
    unique: true,
    validate: {
      validator(v) {
        return isEmail(v);
      },
    },
  },
  password: {
    type: String,
    required: [true, 'Пароль обязателен'],
    select: false,
  },
});

userSchema.static('findUserByCredentials', async function findUserByCredentials(email: string, password: string) {
  const user = await this.findOne({ email }).select('+password'); // this — это модель User

  // не нашёлся — отклоняем промис
  if (!user) {
    return Promise.reject(new HttpError(HttpStatus.Unauthorized.code, 'Неправильные почта или пароль'));
  }
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    return Promise.reject(new HttpError(HttpStatus.Unauthorized.code, 'Неправильные почта или пароль'));
  }
  return user;
});

const User = model<IUser, UserModel>('User', userSchema);
export default User;
