import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Color } from '../../types/Colors';
import { UserEntity } from './User.entity';

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

  @OneToMany(() => UserEntity, (user) => user.id)
  userId: number;
}
