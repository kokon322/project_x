import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  ADMIN = 'Admin',
  MODERATOR = 'Moderator',
  CUSTOMER = 'Customer'
}

@Entity()
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: Role, nullable: false, unique: true })
  role: string;
}