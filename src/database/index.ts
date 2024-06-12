import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { UserEntity } from './entity/User.entity';
import { TileEntity } from './entity/Tile.entity';
import { TileHistoryEntity } from './entity/TileHistory.entity';

dotenv.config();
export const db = new DataSource({
  type: 'sqlite',
  database: <string>process.env.DB_PATH,
  synchronize: true,
  entities: [TileEntity, UserEntity, TileHistoryEntity],
});

export const dbInit = async () => {
  try {
    await db.initialize();
    await db.synchronize();
    console.log('DB connected');
  } catch (e) {
    console.log('[ERROR]\n');
    console.log(e);
  }
};
