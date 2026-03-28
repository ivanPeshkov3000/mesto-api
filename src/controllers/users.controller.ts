import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import 'dotenv/config';

import User from '../models/user.model';
import type { IUser, SessionRequest } from '../utils/types';

function proxyCatch(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Получить всех пользователей
export const getUsers = proxyCatch(async (req: Request, res: Response, next: NextFunction) => {
  const users: IUser[] = await User.find({}, 'name about avatar');
  res.status(200).json(users);
});

// Получить одного пользователя
export const getUser = proxyCatch(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const user = await User.findById(userId, 'name about avatar email').orFail();
  res.status(200).send(user);
});

// Создание пользователя
export const createUser = proxyCatch(async (req: Request, res: Response, next: NextFunction) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await User.create({
    email,
    password: hash, // записываем хеш в базу
    name,
    about,
    avatar,
  });
  res.status(201).send({ message: 'Пользователь создан' });
});

// Обновление профиля
export const updateUser = proxyCatch(async (req: Request, res: Response, next: NextFunction) => {
  const sessionReq = req as SessionRequest;
  const data = Object.fromEntries(Object.entries(req.body).filter(([_, v]) => v !== undefined));

  if (data.password) {
    data.password = await bcrypt.hash(data.password as string, 10);
  }

  await User.findByIdAndUpdate(
    sessionReq.user?._id,
    { ...data },
    { new: true, runValidators: true },
  );
  res.status(200).send({ message: 'Профиль обновлен' });
});

// Обновление аватара пользователя
export const updateAvatar = proxyCatch(async (req: Request, res: Response, next: NextFunction) => {
  const sessionReq = req as SessionRequest;
  const { avatar } = req.body;

  await User.findByIdAndUpdate(
    sessionReq.user?._id,
    { avatar },
    { new: true, runValidators: true },
  );

  res.status(200).send({ message: 'Аватар обновлен' });
});

// Удаление пользователя
export const deleteUser = proxyCatch(async (req: Request, res: Response, next: NextFunction) => {
  await User.findByIdAndDelete(req.params.userId);
  res.status(200).send({ message: 'Удален' });
});

// Log in
export const login = proxyCatch(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const user = await User.findUserByCredentials(email, password);
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as Secret, { expiresIn: '7d' });
  res.cookie('jwt', token, {
    maxAge: 3600000,
    httpOnly: true,
  });
  res.status(200).send({ message: 'Успешный вход' });
});
