import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dto/createUser.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';

describe('UserController', () => {
  let controller: UserController;
  let mockUserService = {
    createUser: jest.fn(() => ({ message: 'mock value from create' })),
    getAllUsers: jest.fn(() => ({ message: 'mock value from getAllUsers' })),
    getUserById: jest.fn(() => ({ message: 'mock value from getUserById' })),
    updateUserById: jest.fn(() => ({ message: 'mock value from updateUserById' })),
    deleteUserById: jest.fn(() => ({ message: 'mock value from deleteUserById' })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
      controllers: [UserController],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
    jest.clearAllMocks();
  });

  const mockCreateUser: CreateUserDto = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('createAdmin should return correct value', async () => {
    const result = await controller.createAdmin(mockCreateUser);

    expect(result).toEqual({ message: 'mock value from create' });

    expect(mockUserService.createUser).toHaveBeenCalledTimes(1);
    expect(mockUserService.createUser).toHaveBeenCalledWith(mockCreateUser, 'Admin', true);
  });

  it('createModerator should return correct value', async () => {
    const result = await controller.createModerator(mockCreateUser);

    expect(result).toEqual({ message: 'mock value from create' });

    expect(mockUserService.createUser).toHaveBeenCalledTimes(1);
    expect(mockUserService.createUser).toHaveBeenCalledWith(mockCreateUser, 'Moderator', false);
  });

  it('createCustomer should return correct value', async () => {
    const result = await controller.createCustomer(mockCreateUser);

    expect(result).toEqual({ message: 'mock value from create' });

    expect(mockUserService.createUser).toHaveBeenCalledTimes(1);
    expect(mockUserService.createUser).toHaveBeenCalledWith(mockCreateUser, 'Customer', false);
  });

  it('getAllUsers should return correct value', async () => {
    const result = await controller.getAllUsers();

    expect(result).toEqual({ message: 'mock value from getAllUsers' });

    expect(mockUserService.getAllUsers).toHaveBeenCalledTimes(1);
    expect(mockUserService.getAllUsers).toHaveBeenCalledWith();
  });

  it('getUserById should return correct value', async () => {
    const result = await controller.getUserById(2);

    expect(result).toEqual({ message: 'mock value from getUserById' });

    expect(mockUserService.getUserById).toHaveBeenCalledTimes(1);
    expect(mockUserService.getUserById).toHaveBeenCalledWith(2);
  });

  it('updateUserById should return correct value', async () => {
    const mockUpdateUser: UpdateUserDto = {
      firstName: '',
      lastName: '',
    };
    const result = await controller.updateUserById(2, mockUpdateUser);

    expect(result).toEqual({ message: 'mock value from updateUserById' });

    expect(mockUserService.updateUserById).toHaveBeenCalledTimes(1);
    expect(mockUserService.updateUserById).toHaveBeenCalledWith(2, mockUpdateUser);
  });

  it('deleteUserById should return correct value', async () => {
    const result = await controller.deleteUserById(2);

    expect(result).toEqual({ message: 'mock value from deleteUserById' });

    expect(mockUserService.deleteUserById).toHaveBeenCalledTimes(1);
    expect(mockUserService.deleteUserById).toHaveBeenCalledWith(2);
  });
});
