import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role } from './entities/role.entity';
import { CreateUserResponseInterface } from './types/createUserResponse.interface';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Post('/admin')
  async createAdmin(@Body() createUserDto: CreateUserDto): Promise<CreateUserResponseInterface> {
    return await this.userService.createUser(createUserDto, Role.ADMIN, true);
  }

  @Post('/moderator')
  async createModerator(@Body() createUserDto: CreateUserDto): Promise<CreateUserResponseInterface> {
    return await this.userService.createUser(createUserDto, Role.MODERATOR, false);
  }

  @Post('/customer')
  async createCustomer(creteUserDto: CreateUserDto): Promise<CreateUserResponseInterface> {
    return await this.userService.createUser(creteUserDto, Role.CUSTOMER, false);
  }
}
