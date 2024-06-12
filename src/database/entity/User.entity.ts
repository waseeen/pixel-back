import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  photo: string;

  @Column()
  nickname: string;

  @Column({ default: 0 })
  cooldown: number;
}
