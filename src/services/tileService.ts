import { db } from '../database';
import { TileEntity } from '../database/entity/Tile.entity';
import { TileHistoryEntity } from '../database/entity/TileHistory.entity';
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
      const newTileHistory = this.tileHistoryRepository.create({
        tileNumber: tile.number,
        newColor: tile.color,
        time: new Date(),
        userId: userId,
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
