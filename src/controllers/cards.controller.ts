import { NextFunction, Request, Response } from 'express';

import Card from '../models/card.model';
import type { ICard, SessionRequest } from '../utils/types';

function proxyCatch(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Получить все карточки
export const getCards = proxyCatch(async (req: Request, res: Response, next: NextFunction) => {
  const cards: ICard[] = await Card.find().populate('owner');
  return res.json(cards);
});

// Создать карточку
export const createCard = proxyCatch(async (req: Request, res: Response, next: NextFunction) => {
  const sessionReq = req as SessionRequest;
  const { name, link } = req.body;
  const card: ICard = await Card.create({
    name,
    link,
    owner: sessionReq.user._id,
  });
  return res.status(201).json(card);
});

// Удалить карточку
export const deleteCard = proxyCatch(async (req: Request, res: Response, next: NextFunction) => {
  const sessionReq = req as SessionRequest;
  const card = await Card.findById(req.params.cardId);
  if (!card || String(card.owner) !== sessionReq.user._id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  await Card.deleteOne({ id: req.params.cardId });
  return res.json({ message: 'Card deleted' });
});

// Лойс
export const likeCard = proxyCatch(async (req: Request, res: Response, next: NextFunction) => {
  const sessionReq = req as SessionRequest;
  const card: ICard | null = await Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: sessionReq.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  );
  if (!card) return res.status(404).json({ error: 'Card not found' });

  return res.json({ likes: card.likes.length });
});

// Диз
export const dislikeCard = proxyCatch(async (req: Request, res: Response, next: NextFunction) => {
  const sessionReq = req as SessionRequest;
  const card: ICard | null = await Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: sessionReq.user._id } }, // убрать _id из массива
    { new: true },
  );

  if (!card) return res.status(404).json({ error: 'Card not found' });

  return res.json({ likes: card.likes.length });
});
