import { Router } from 'express';

import * as controller from '../controllers/cards.controller';
import celebrate from '../middlewares/celebrate';

const publicRouter = Router();
const protectedRouter = Router();

// Публичные роуты
//-----------------------------------------------------------------------------------------

// возвращает все карточки
publicRouter.get('/cards', celebrate.getCards, controller.getCards);

// Защищенные роуты
//------------------------------------------------------------------------------------------
// создаёт карточку
protectedRouter.post('/cards', celebrate.createCard, controller.createCard);

// удаляет карточку по идентификатору
protectedRouter.delete('/cards/:cardId', celebrate.deleteCard, controller.deleteCard);

// поставить лайк карточке
protectedRouter.put('/cards/:cardId/likes', celebrate.likeCard, controller.likeCard);

// убрать лайк с карточки
protectedRouter.delete('/cards/:cardId/likes', celebrate.dislikeCard, controller.dislikeCard);

export default { protectedRouter, publicRouter };
