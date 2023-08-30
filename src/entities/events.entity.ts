import { Column, Entity } from 'typeorm';
import { CustomBaseEntity } from './index.entity';

@Entity()
export class EventEntity extends CustomBaseEntity {
  @Column()
  public name: string;

  @Column()
  public message: string;

  @Column({ nullable: true, type: 'jsonb' })
  public audiences?: any;

  @Column({ nullable: true })
  public date?: Date;

  @Column({ nullable: true })
  public courseId: string;
}
