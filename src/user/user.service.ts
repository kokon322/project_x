import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role, RoleEntity } from './entities/role.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { ErrorMessages } from '../constant/errorMessages';
import { CreateUserResponseInterface } from './types/createUserResponse.interface';
import { EmailVerifyEntity } from './entities/emailVerify.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity) private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(EmailVerifyEntity) private readonly emailVerificationRepository: Repository<EmailVerifyEntity>) {
  }

  async createUser(createUserDto: CreateUserDto, role: Role, isVerify: boolean): Promise<CreateUserResponseInterface> {
    try {
      await this.checkIsEmailAlreadyExistInDB(createUserDto.email);
      const [roleObject] = await this.roleRepository.find({ where: { role } });
      const [verify] = await this.emailVerificationRepository.find({ where: { isVerify: isVerify } });

      const user = this.userRepository.create({
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        email: createUserDto.email,
        password: createUserDto.password,
        role: roleObject,
        verify,
      });

      const result = await this.userRepository.save(user);
      delete result.password;
      delete result.role;

      return { user: result };
    } catch (err) {
      throw new HttpException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: [err.message],
      }, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  private async checkIsEmailAlreadyExistInDB(email: string): Promise<void> {
    const isEmailExist = await this.userRepository.findOneBy({ email });
    if (isEmailExist) {
      throw new HttpException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: ErrorMessages.EMAIL_IS_EXIST,
      }, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    return;
  }
}
