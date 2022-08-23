import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { hash } from 'bcrypt';
import { EmailVerifyEntity } from './emailVerify.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: false, nullable: false })
  email: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updateAt: Date;

  @Column({ nullable: false, select: false })
  password: string;

  @ManyToOne(() => RoleEntity, role => role.id, { nullable: false })
  @JoinColumn()
  role: RoleEntity;

  @ManyToOne(() => EmailVerifyEntity, emailVerify => emailVerify.id, { nullable: false })
  @JoinColumn()
  verify: EmailVerifyEntity;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
}