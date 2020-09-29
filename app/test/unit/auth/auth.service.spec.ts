import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../../../src/users/users.module';
import { AuthController } from '../../../src/auth/auth.controller';
import { AuthService } from '../../../src/auth/auth.service';
import { JwtStrategy } from '../../../src/auth/strategies/jwt.strategy';
import { Oauth2Strategy } from '../../../src/auth/strategies/oauth2.strategy';
import { EntityManagerWrapperService } from '../../../src/utils/entity-manager-wrapper.service';
import { mockUsers } from '../../mock-user-data';
import { User } from '../../../src/entity/User';
import { AdminFirebaseStrategy } from '../../../src/auth/strategies/admin-firebase.strategy';

jest.mock('../../../src/utils/entity-manager-wrapper.service');

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
          useFactory: async () => ({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME }
          })
        })
      ],
      controllers: [AuthController],
      providers: [AuthService, Oauth2Strategy, JwtStrategy, AdminFirebaseStrategy]
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should return null when user is not validated', async () => {
    mockFindByUserIdReturnedValue();
    const userId = 1;
    const secret = "inmedical.dev@2021";
    const wrapperService = new EntityManagerWrapperService();
    const result = await authService.validateUser(userId, secret, wrapperService);
    expect(result).toEqual(null);
  });

  it('should validate a user with secret', async () => {
    mockFindByUserIdReturnedValue();
    const userId = 1;
    const secret = "inmedical.dev@2020";
    const expectedResult = mockUsers.usersResult[0];
    const wrapperService = new EntityManagerWrapperService();
    const result = await authService.validateUser(userId, secret, wrapperService);
    expect(result).toEqual(expectedResult);
  });

  it('should validate a user by userId', async () => {
    mockFindByUserIdReturnedValue();
    const userId = 1;
    const expectedResult = mockUsers.usersResult[0];
    const wrapperService = new EntityManagerWrapperService();
    const result = await authService.validateUserById(userId, wrapperService);
    expect(result).toEqual(expectedResult);
  });

  it('should return null when user is not validated by id', async () => {
    mockFindByUserIdEmpty();
    const userId = 1;
    const wrapperService = new EntityManagerWrapperService();
    const result = await authService.validateUserById(userId, wrapperService);
    expect(result).toEqual({});
  });

  it('should return an access token', async () => {
    const user = new User();
    Object.assign(user, mockUsers.users[0]);
    const result = await authService.login(user);
    expect(result).toHaveProperty('accessToken');
  });

  it('should register user in db', async () => {
    mockCreateUserSuccessful();
    const dataToCreate = mockUsers.usersCreate[0];
    const expectedResult = mockUsers.users[0];
    const wrapperService = new EntityManagerWrapperService();
    const result =  await authService.saveUser(dataToCreate, wrapperService);
    expect(result).toEqual(expectedResult);
  });

  const mockFindByUserIdReturnedValue = () => {
    const findByUserId = EntityManagerWrapperService.prototype.findUserById = jest.fn();
    findByUserId.mockReturnValue(mockUsers.users[0]);
  };

  const mockFindByUserIdEmpty = () => {
    const findByUserId = EntityManagerWrapperService.prototype.findUserById = jest.fn();
    findByUserId.mockReturnValue({});
  };

  const mockCreateUserSuccessful = () => {
    const returnedUser = new User();
    Object.assign(returnedUser, mockUsers.users[0]);
  
    const save = EntityManagerWrapperService.prototype.save = jest.fn();
    save.mockReturnValue(returnedUser);
  };
});
