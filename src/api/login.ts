import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { db } from '../database';
import { UserEntity } from '../database/entity/User.entity';
const login = Router();
const userRepository = db.getRepository(UserEntity);

interface VKIDPayload {
  uuid: string;
  token: string;
  type: 'silent_token';
}

interface VKIDExchangePayload {
  access_token: string;
  access_token_id: string;
  user_id: number;
  additional_setup_required: boolean;
  is_partial: boolean;
  is_service: boolean;
  source: number;
  source_description: string;
  expires_id: number;
}

const service_token = process.env.VK_SERVICE_TOKEN;

login.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    try {
      const payload = JSON.parse(req.query.payload as string) as VKIDPayload;
      const exchange = await fetch('https://api.vk.com/method/auth.exchangeSilentAuthToken', {
        body: `v=5.199&token=${payload.token}&access_token=${service_token}&uuid=${payload.uuid}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
      });
      const exchange_json = await exchange.json();
      const exchange_payload = exchange_json.response as VKIDExchangePayload;
      const profile_data = await fetch(
        'https://api.vk.com/method/users.get?user_ids=' +
          exchange_payload.user_id +
          '&fields=photo_200&access_token=' +
          exchange_payload.access_token +
          '&v=5.199',
      );
      const profile_data_json = await profile_data.json();
      const p = profile_data_json.response[0];
      const user = await userRepository.findOne({ where: { id: exchange_payload.user_id } });
      if (user) {
        await userRepository.update(
          { id: exchange_payload.user_id },
          {
            token: [user.token, exchange_payload.access_token].join(','),
            photo: p.photo_200,
          },
        );
      } else {
        const newUser = userRepository.create({
          id: exchange_payload.user_id,
          token: exchange_payload.access_token,
          photo: p.photo_200,
          nickname: [p.first_name, p.last_name].join(' '),
        });
        await userRepository.save(newUser);
      }
      res.redirect(
        'https://pb.waseeen.ru?id=' +
          exchange_payload.user_id +
          '&token=' +
          exchange_payload.access_token,
      );
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: e });
    }
  }),
);

export default login;
