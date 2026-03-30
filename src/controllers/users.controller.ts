import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import 'dotenv/config';

import User from '../models/user.model';
import type { IUser, SessionRequest } from '../utils/types';

function promiseCatch(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Получить всех пользователей
export const getUsers = promiseCatch(async (req: Request, res: Response) => {
  const users: IUser[] = await User.find({}, 'name about avatar');
  res.status(200).json(users);
});

// Получить одного пользователя
export const getUser = promiseCatch(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = await User.findById(userId, 'name about avatar email').orFail();
  res.status(200).send(user);
});

// Получить свой профиль
export const getMe = promiseCatch(async (req: SessionRequest, res: Response) => {
  const userId = req.user._id;
  const user = await User.findById(userId, 'name about avatar email').orFail();
  res.status(200).send(user);
});

// Создание пользователя
export const createUser = promiseCatch(async (req: Request, res: Response) => {
  const data = Object.fromEntries(Object.entries(req.body).filter(([_, v]) => v !== undefined));
  data.password = await bcrypt.hash(data.password as string, 10);

  const user = await User.create({ ...data });
  const { password: _password, ...userWithoutPassword } = user.toObject();
  res.status(201).send(userWithoutPassword);
});

// Обновление профиля
export const updateUser = promiseCatch(async (req: SessionRequest, res: Response) => {
  const data = Object.fromEntries(Object.entries(req.body).filter(([_, v]) => v !== undefined));

  if (data.password) data.password = await bcrypt.hash(data.password as string, 10);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { ...data },
    { new: true, runValidators: true },
  );
  res.status(200).send(user);
});

// Обновление аватара пользователя
export const updateAvatar = promiseCatch(async (req: SessionRequest, res: Response) => {
  const { avatar } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  );

  res.status(200).send(user);
});

// Удаление пользователя
export const deleteUser = promiseCatch(async (req: SessionRequest, res: Response) => {
  const user = await User.findByIdAndDelete(req.user._id);
  res.status(200).send(user);
});

// Log in
export const login = promiseCatch(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findUserByCredentials(email, password);
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as Secret, { expiresIn: '7d' });
  res.cookie('jwt', token, {
    maxAge: 3600000,
    httpOnly: true,
  });
  const { password: _password, ...userWithoutPassword } = user.toObject();
  res.status(200).send(userWithoutPassword);
});
