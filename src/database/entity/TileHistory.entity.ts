import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Color } from '../../types/Colors';

@Entity('tileHistory')
export class TileHistoryEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  tileNumber: number;

  @Column()
  newColor: Color;

  @Column()
  time: Date;
}
