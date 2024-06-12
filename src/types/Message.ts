import { Tile } from './Tile';

export enum MessageType {
  UPDATE = 'tile_update',
  CONNECT = 'connect',
}

export interface Message<T extends MessageType> {
  type: T;
  payload: T extends MessageType.UPDATE
    ? Tile
    : T extends MessageType.CONNECT
    ? {
        tiles: Tile[];
        size: [number, number];
        cooldown: number;
      }
    : null;
}
