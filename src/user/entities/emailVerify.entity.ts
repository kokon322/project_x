import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EmailVerifyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  isVerify: boolean;
}