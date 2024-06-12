import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Color } from '../../types/Colors';

@Entity('tile')
export class TileEntity {
  @PrimaryColumn()
  number: number;

  @Column()
  color: Color;
}
