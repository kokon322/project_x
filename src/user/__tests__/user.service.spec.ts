import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserEntity } from '../entities/user.entity';
import { RoleEntity } from '../entities/role.entity';
import { EmailVerifyEntity } from '../entities/emailVerify.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserService', () => {
  let service: UserService;
  const mockUserEntity = {};
  const mockRoleEntity = {};
  const mockEmailVerifyEntity = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService,
        { provide: getRepositoryToken(UserEntity), useValue: mockUserEntity },
        { provide: getRepositoryToken(RoleEntity), useValue: mockRoleEntity },
        { provide: getRepositoryToken(EmailVerifyEntity), useValue: mockEmailVerifyEntity },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
