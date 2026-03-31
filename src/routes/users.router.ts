import { Router } from 'express';

import * as controller from '../controllers/users.controller';
import celebrate from '../middlewares/celebrate';

const publicRouter = Router();
const protectedRouter = Router();

// Открытые роуты
//-----------------------------------------------------------------------------------

// создаёт пользователя
publicRouter.post('/signup', celebrate.createUser, controller.createUser);
// логин
publicRouter.post('/signin', celebrate.login, controller.login);

// Защищенные роуты
//-----------------------------------------------------------------------------------

// возвращает всех пользователей
protectedRouter.get('/users', celebrate.getUsers, controller.getUsers);

// возвращает пользователя по _id
protectedRouter.get('/users/:userId', celebrate.getUser, controller.getUser);

// просмотр собственного профиля
protectedRouter.get('/users/me', celebrate.getMe, controller.getMe);

// обновляет профиль
protectedRouter.patch('/users/me', celebrate.updateUser, controller.updateUser);

// обновляет аватар
protectedRouter.patch('/users/me/avatar', celebrate.updateAvatar, controller.updateAvatar);

// удаляет юзера
protectedRouter.delete('/users/me', celebrate.deleteUser, controller.deleteUser);

export default { publicRouter, protectedRouter };
