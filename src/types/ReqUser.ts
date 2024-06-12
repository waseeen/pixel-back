import { Request } from 'express';
import { UserEntity } from '../database/entity/User.entity';

export interface ReqUser extends Request {
  user?: UserEntity;
}
