import express, { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { tilesProvider, ws } from '..';
import { Message, MessageType } from '../types/Message';
import login from './login';
import profile from './profile';
import { db } from '../database';
import { UserEntity } from '../database/entity/User.entity';
import checkAuth from '../checkAuth';
import { ReqUser } from '../types/ReqUser';

const api = Router();
const userRepository = db.getRepository(UserEntity);
api.get(
  '/',
  expressAsyncHandler(async (_res, res) => {
    try {
      const response: Message<MessageType.CONNECT> = {
        type: MessageType.CONNECT,
        payload: {
          tiles: tilesProvider.get(),
          size: tilesProvider.size,
          cooldown: tilesProvider.cooldown,
        },
      };
      res.status(200).json(response);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
  }),
);

api.use('/login', express.json(), login);

api.use(checkAuth);

api.use('/profile', express.json(), profile);

api.post(
  '/',
  expressAsyncHandler(async (req: ReqUser, res) => {
    try {
      const user_id = req.user?.id;

      if (!user_id) {
        res.status(401).json({ error: 'UNAUTHORIZED' });
        return;
      }
      const user = await userRepository.findOne({ where: { id: Number(user_id) } });
      if (!user) {
        res.status(401).json({ error: 'UNAUTHORIZED' });
        return;
      }
      if (user.cooldown > Date.now()) {
        res.status(403).json({ error: 'WAIT' });
        return;
      }
      const body = req.body as Message<MessageType.UPDATE>;
      if (body.type == MessageType.UPDATE) {
        if (!body.payload.color) {
          res.status(400).json({ error: 'NO_COLOR' });
          return;
        }
        if (body.payload.number === null) {
          res.status(400).json({ error: 'NO_PIXEL' });
          return;
        }
        await tilesProvider.edit(body.payload, user_id);
        ws.clients.forEach((c) => {
          c.send(JSON.stringify(body));
        });
        res.status(200).json(body);
      }
      await userRepository.update(user.id, { cooldown: Date.now() + tilesProvider.cooldown });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
  }),
);

export default api;
