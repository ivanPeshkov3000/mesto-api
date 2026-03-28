import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

import { IUser, UserModel } from '../utils/types';

const userSchema = new Schema<IUser, UserModel>({
  name: {
    type: String,
    required: [true, 'Требуется указать имя'],
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: [true, 'Требуется указать описание'],
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: [true, 'Аватар обязателен'],
  },
  email: {
    type: String,
    required: [true, 'Email обязателен'],

  },
  password: {
    type: String,
    required: [true, 'Пароль обязателен'],
  },
});

userSchema.static('findUserByCredentials', async function findUserByCredentials(email: string, password: string) {
  const user = await this.findOne({ email }); // this — это модель User

  // не нашёлся — отклоняем промис
  if (!user) {
    return Promise.reject(new Error('Неправильные почта или пароль'));
  }
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    return Promise.reject(new Error('Неправильные почта или пароль'));
  }
  return user;
});

const User = model<IUser, UserModel>('User', userSchema);
export default User;
