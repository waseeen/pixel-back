import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
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

  @ManyToOne(() => UserEntity, (user) => user.id)
  // @JoinColumn()
  user: UserEntity;
}
