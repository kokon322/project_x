import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RoleEntity } from './entities/role.entity';
import { EmailVerifyEntity } from './entities/emailVerify.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity, EmailVerifyEntity]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {
}
