import { Router } from 'express';

import * as controller from '../controllers/users.controller';
import celebrate from '../middlewares/celebrate';

const publicRouter = Router();
const protectedRouter = Router();

// Открытые роуты
//-----------------------------------------------------------------------------------

// создаёт пользователя
publicRouter.post('/users', celebrate.createUser, controller.createUser);
publicRouter.post('/users/login', celebrate.login, controller.login);

// Защищенные роуты
//-----------------------------------------------------------------------------------

// возвращает всех пользователей
protectedRouter.get('/users', celebrate.getUsers, controller.getUsers);

// возвращает пользователя по _id
protectedRouter.get('/users/:userId', celebrate.getUser, controller.getUser);

// обновляет профиль
protectedRouter.patch('/users/me', celebrate.updateUser, controller.updateUser);

// обновляет аватар
protectedRouter.patch('/users/me/avatar', celebrate.updateAvatar, controller.updateAvatar);

// удаляет юзера
protectedRouter.delete('/users/:userId', celebrate.deleteUser, controller.deleteUser);

export default { publicRouter, protectedRouter };
