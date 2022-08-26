import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role, RoleEntity } from './entities/role.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { ErrorMessages } from '../constant/errorMessages';
import { CreateUserResponseInterface } from './types/createUserResponse.interface';
import { EmailVerifyEntity } from './entities/emailVerify.entity';
import { GetAllUsersResponseInterface } from './types/getAllUsersResponse.interface';
import { UpdateUserDto } from './dto/updateUser.dto';
import { GetUserByEmailDto } from './dto/getUserByEmail.dto';
import { GetOneUserInterface } from './types/getOneUser.interface';

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

  async getAllUsers(): Promise<GetAllUsersResponseInterface> {
    try {
      return { users: await this.userRepository.find({ relations: ['verify', 'role'] }) };
    } catch (err) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: [err.message],
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async getUserById(id: number): Promise<GetOneUserInterface> {
    try {
      return { user: await this.userRepository.findOne({ where: { id: id }, relations: ['verify', 'role'] }) };
    } catch (err) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: [err.message],
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async getUserByEmail(getUserByEmailDto: GetUserByEmailDto): Promise<GetOneUserInterface> {
    try {
      return {
        user: await this.userRepository.findOne({
          where: { email: getUserByEmailDto.email },
          relations: ['verify', 'role'],
        }),
      };
    } catch (err) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: [err.message],
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async updateUserById(userId: number, updateUserDto: UpdateUserDto): Promise<GetOneUserInterface> {
    try {
      delete updateUserDto.confirmPassword;
      const result = await this.userRepository.createQueryBuilder()
        .update(UserEntity)
        .where({ id: userId })
        .set(updateUserDto)
        .returning('*')
        .execute();
      return { user: result.raw[0] };
    } catch (err) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: [err.message],
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteUserById(id: number): Promise<number> {
    try {
      const result = await this.userRepository.delete({ id: id });
      return result.affected;
    } catch (err) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: [err.message],
      }, HttpStatus.BAD_REQUEST);
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
  }
}
