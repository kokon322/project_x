import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserEntity } from '../entities/user.entity';
import { RoleEntity, Role } from '../entities/role.entity';
import { EmailVerifyEntity } from '../entities/emailVerify.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/createUser.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { GetUserByEmailDto } from '../dto/getUserByEmail.dto';
import { UpdateUserPasswordDto } from '../dto/updateUserPassword.dto';

describe('UserService', () => {
  let service: UserService;
  const mockUserEntity = {
    create: jest.fn().mockImplementation(() => Promise.resolve({ message: 'mock value from create' })),
    save: jest.fn().mockImplementation(() => Promise.resolve([{ message: 'mock value from save' }])),
    find: jest.fn().mockImplementation(() => Promise.resolve([{ message: 'mock value from find' }])),
    findOne: jest.fn().mockImplementation(() => Promise.resolve([{ message: 'mock value from findOne' }])),
    delete: jest.fn().mockImplementation(() => Promise.resolve({ affected: 1 })),
    findOneBy: jest.fn().mockImplementation(() => Promise.resolve(false)),
    createQueryBuilder: jest.fn(() => ({
      update: jest.fn(() =>
        ({
          where: jest.fn(() =>
            ({
              set: jest.fn(() =>
                ({
                  returning: jest.fn(() =>
                    ({ execute: jest.fn(() => ({ raw: [{}] })) })),
                })),
            })),
        })),
    })),
  };
  const mockRoleEntity = {
    find: jest.fn().mockImplementation(() => Promise.resolve([{ message: 'mock value from find RoleEntity' }])),
  };
  const mockEmailVerifyEntity = {
    find: jest.fn().mockImplementation(() => Promise.resolve([{ message: 'mock value from find EmailVerifyEntity' }])),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService,
        { provide: getRepositoryToken(UserEntity), useValue: mockUserEntity },
        { provide: getRepositoryToken(RoleEntity), useValue: mockRoleEntity },
        { provide: getRepositoryToken(EmailVerifyEntity), useValue: mockEmailVerifyEntity },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createUser should return correct value', async () => {
    const mockUser: CreateUserDto = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    const { confirmPassword, ...user } = mockUser;

    const mockUserForCreate = {
      ...user,
      role: {
        'message': 'mock value from find RoleEntity',
      },
      verify: {
        'message': 'mock value from find EmailVerifyEntity',
      },
    };

    const result = await service.createUser(mockUser, Role.ADMIN, true);

    expect(result).toEqual({ user: [{ message: 'mock value from save' }] });
    expect(mockUserEntity.create).toHaveBeenCalledTimes(1);
    expect(mockUserEntity.create).toHaveBeenCalledWith(mockUserForCreate);
    expect(mockUserEntity.save).toHaveBeenCalledTimes(1);
    expect(mockUserEntity.save).toHaveBeenCalledWith(Promise.resolve({}));
    expect(mockUserEntity.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockUserEntity.findOneBy).toHaveBeenCalledWith({ email: '' });
  });

  it('getAllUsers should return correct value', async () => {
    const result = await service.getAllUsers();

    expect(result).toEqual({ users: [{ message: 'mock value from find' }] });
    expect(mockUserEntity.find).toHaveBeenCalledTimes(1);
    expect(mockUserEntity.find).toHaveBeenCalledWith({ relations: ['verify', 'role'] });
  });

  it('getUserById should return correct value', async () => {
    const result = await service.getUserById(2);

    expect(result).toEqual({ user: [{ message: 'mock value from findOne' }] });
    expect(mockUserEntity.findOne).toHaveBeenCalledTimes(1);
    expect(mockUserEntity.findOne).toHaveBeenCalledWith({ relations: ['verify', 'role'], where: { 'id': 2 } });
  });

  it('getUserByEmail should return correct value', async () => {
    const mockUserEmail: GetUserByEmailDto = { email: '' };
    const result = await service.getUserByEmail(mockUserEmail);

    expect(result).toEqual({ user: [{ message: 'mock value from findOne' }] });
    expect(mockUserEntity.findOne).toHaveBeenCalledTimes(1);
    expect(mockUserEntity.findOne).toHaveBeenCalledWith({ relations: ['verify', 'role'], where: { 'email': '' } });
  });

  it('updateUserById should return correct value', async () => {
    const mockUpdateUser: UpdateUserDto = {
      firstName: '',
      lastName: '',
    };
    const result = await service.updateUserById(2, mockUpdateUser);

    expect(result).toEqual({ user: {} });
    expect(mockUserEntity.createQueryBuilder).toHaveBeenCalledTimes(1);
    expect(mockUserEntity.createQueryBuilder).toHaveBeenCalledWith();
  });

  it('updateUserPasswordById should return correct value', async () => {
    const mockUpdateUserPasswordDto: UpdateUserPasswordDto = {
      password: '',
      confirmPassword: '',
    };
    mockUserEntity.findOneBy = jest.fn().mockImplementation(() => Promise.resolve({}));
    const result = await service.updateUserPasswordById(2, mockUpdateUserPasswordDto);

    expect(result).toEqual({ message: 'Success' });
    expect(mockUserEntity.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockUserEntity.findOneBy).toHaveBeenCalledWith({ id: 2 });
    expect(mockUserEntity.save).toHaveBeenCalledTimes(1);
    expect(mockUserEntity.save).toHaveBeenCalledWith({ password: '' });
  });

  it('deleteUserById should return correct value', async () => {
    const result = await service.deleteUserById(2);

    expect(result).toEqual(1);
    expect(mockUserEntity.delete).toHaveBeenCalledTimes(1);
    expect(mockUserEntity.delete).toHaveBeenCalledWith({ id: 2 });
  });
});
