import { Column, Entity } from 'typeorm';
import { CustomBaseEntity } from './index.entity';

@Entity()
export class EventEntity extends CustomBaseEntity {
  @Column()
  public name: string;

  @Column()
  public message: string;

  @Column({ nullable: true })
  public courseId: string;

  @Column({ nullable: true })
  public date?: Date;
}
