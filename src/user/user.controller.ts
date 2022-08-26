import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { Role } from './entities/role.entity';
import { CreateUserResponseInterface } from './types/createUserResponse.interface';
import { GetAllUsersResponseInterface } from './types/getAllUsersResponse.interface';
import { UpdateUserDto } from './dto/updateUser.dto';
import { GetOneUserInterface } from './types/getOneUser.interface';

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
  async createCustomer(@Body() creteUserDto: CreateUserDto): Promise<CreateUserResponseInterface> {
    return await this.userService.createUser(creteUserDto, Role.CUSTOMER, false);
  }

  @Get()
  async getAllUsers(): Promise<GetAllUsersResponseInterface> {
    return await this.userService.getAllUsers();
  }

  @ApiParam({ name: 'id', required: true, example: 1 })
  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<GetOneUserInterface> {
    return await this.userService.getUserById(id);
  }

  @Put(':id')
  async updateUserById(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<GetOneUserInterface> {
    return await this.userService.updateUserById(id, updateUserDto);
  }

  @ApiParam({ name: 'id', required: true, example: 1 })
  @Delete(':id')
  async deleteUserById(@Param('id') id: number): Promise<number> {
    return await this.userService.deleteUserById(id);
  }
}
