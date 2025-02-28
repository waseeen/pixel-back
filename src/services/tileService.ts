import { db } from '../database';
import { TileEntity } from '../database/entity/Tile.entity';
import { TileHistoryEntity } from '../database/entity/TileHistory.entity';
import { UserEntity } from '../database/entity/User.entity';
import { Tile } from '../types/Tile';
let tileCache: TileEntity[] = [];
class TileService {
  size: [number, number];
  cooldown: number;
  constructor(width: number, height: number, cooldown: number) {
    this.size = [width, height];
    this.cooldown = cooldown;
  }
  tileRepository = db.getRepository(TileEntity);
  tileHistoryRepository = db.getRepository(TileHistoryEntity);
  userRepository = db.getRepository(UserEntity);

  initGet = async () => {
    const tiles = await this.tileRepository.find();
    tileCache = tiles;
  };

  get = () => {
    return tileCache;
  };

  edit = async (tile: Tile, userId: number) => {
    try {
      await this.tileRepository.update({ number: tile.number }, tile);
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw 'USER_NOT_FOUND';
      }
      const newTileHistory = this.tileHistoryRepository.create({
        tileNumber: tile.number,
        newColor: tile.color,
        time: new Date(),
        user: user,
      });
      await this.tileHistoryRepository.save(newTileHistory);
      tileCache[tile.number] = tile;
    } catch (error) {
      console.log('[ERROR] ', error);
      throw 'Что-то пошло не так';
    }
  };
}

export default TileService;
