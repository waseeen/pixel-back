import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { db } from '../database';
import { UserEntity } from '../database/entity/User.entity';
import { ReqUser } from '../types/ReqUser';
const profile = Router();

const userRepository = db.getRepository(UserEntity);

profile.get(
  '/',
  expressAsyncHandler(async (req: ReqUser, res) => {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'UNAUTHORIZED' }).end();
      return;
    }
    res.status(200).json(user).end();
    return;
  }),
);

profile.patch(
  '/nickname',
  expressAsyncHandler(async (req: ReqUser, res) => {
    if (!req.body.nickname) {
      res.status(204).end();
      return;
    }
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'UNAUTHORIZED' }).end();
      return;
    }
    await userRepository.update({ id: user.id }, { nickname: req.body.nickname });
    res.status(204).end();
    return;
  }),
);

profile.patch(
  '/',
  expressAsyncHandler(async (req: ReqUser, res) => {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'UNAUTHORIZED' }).end();
      return;
    }
    if (user.token.split(',').length > 1) {
      const tokens = user.token.split(',');
      const toDel = tokens.findIndex((t) => t == req.body.token);
      tokens.splice(toDel, 1);
      await userRepository.update({ id: user.id }, { token: tokens.join(',') });
    } else {
      await userRepository.update({ id: user.id }, { token: '[]' });
    }
    res.status(204).end();
    return;
  }),
);

export default profile;
