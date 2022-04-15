import { CollegeDepartment } from 'src/college-department/entity/college-department.entity';
import { User } from 'src/user/entity/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CoordinatorCollegeDepartment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => CollegeDepartment, { onDelete: 'CASCADE' })
  department: CollegeDepartment;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
