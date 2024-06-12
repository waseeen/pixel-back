import { NextFunction, Request, Response } from 'express';
import { db } from '../database';
import { UserEntity } from '../database/entity/User.entity';

const userRepository = db.getRepository(UserEntity);

const checkAuth = async (
  req: Request & { user?: UserEntity },
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('No authorization header');
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }
  const [scheme, auth] = authHeader.split(' ');
  if (scheme !== 'Basic') {
    res.status(401).json({ error: 'Unsupported authorization scheme' });
    return;
  }
  const [id, token] = atob(auth).split(':');
  const user = await userRepository.findOne({
    where: { id: Number(id) },
  });
  if (!user) return res.status(401).json({ error: 'UNAUTHORIZED' });
  if (!user.token.split(',').includes(token))
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  req.user = user;
  next();
};

export default checkAuth;
