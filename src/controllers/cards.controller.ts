import { Request, Response } from 'express';

import Card from '../models/card.model';
import type { SessionRequest } from '../utils/types';
import HttpError from '../utils/errors/httpError';
import { HttpStatus } from '../utils/httpStatuses';
import promiseCatch from '../utils/promiseCatch';

// Получить все карточки
export const getCards = promiseCatch(async (req: Request, res: Response) => {
  const cards = await Card.find().populate('owner');
  return res.json(cards);
});

// Создать карточку
export const createCard = promiseCatch(async (req: SessionRequest, res: Response) => {
  const { name, link } = req.body;
  const card = await Card.create({
    name,
    link,
    owner: req.user._id,
  });
  return res.status(201).json(card);
});

// Удалить карточку
export const deleteCard = promiseCatch(async (req: SessionRequest, res: Response) => {
  const card = await Card.findById(req.params.cardId);

  if (!card) throw new HttpError(HttpStatus.NotFound);
  if (String(card.owner) !== req.user._id) throw new HttpError(HttpStatus.Forbidden);

  await Card.deleteOne({ id: req.params.cardId });
  return res.json({ message: 'Card deleted' });
});

// Лойс
export const likeCard = promiseCatch(async (req: SessionRequest, res: Response) => {
  const card = await Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  );
  if (!card) throw new HttpError(HttpStatus.NotFound);

  return res.json({ likes: card.likes.length });
});

// Диз
export const dislikeCard = promiseCatch(async (req: SessionRequest, res: Response) => {
  const card = await Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  );

  if (!card) throw new HttpError(HttpStatus.NotFound);

  return res.json({ likes: card.likes.length });
});
