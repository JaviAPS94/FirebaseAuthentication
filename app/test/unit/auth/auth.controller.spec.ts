import { HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mockUsers } from '../../mock-user-data';
import { AuthController } from '../../../src/auth/auth.controller';
import { AuthService } from '../../../src/auth/auth.service';
import { Oauth2Strategy } from '../../../src/auth/strategies/oauth2.strategy';
import { JwtStrategy } from '../../../src/auth/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../../../src/users/users.module';
import { User } from '../../../src/entity/User';
import { UserDto } from '../../../src/auth/dto/user.dto';

describe('Auth Controller', () => {
  let authController: AuthController;

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
      providers: [AuthService, Oauth2Strategy, JwtStrategy]
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('POST should return 201 when login is Ok', async () => {
    const requestObject = {
      user: mockUsers.users[0]
    };
    const returnedValue = await authController.login(requestObject);
    expect(returnedValue).toHaveProperty('accessToken');
  });

  it('POST should return 201 when token is Ok', async () => {
    const getValidatedUserById = AuthService.prototype.getValidatedUserById = jest.fn();
    getValidatedUserById.mockReturnValue(mockUsers.usersResult[0]);
    const user = new User();
    Object.assign(user, mockUsers.users[0]);
    delete user.secret;
    const requestObject = {
      user: {
        id: 1
      }
    };
    const returnedValue = await authController.validateToken(requestObject);
    expect(returnedValue).toEqual(user);
  });

  it('POST should return 201 when post data is Ok', async () => {
    const createUser = AuthService.prototype.getUserRegistered = jest.fn();
    createUser.mockReturnValue(mockUsers.usersCreate[0]);
    const userDto = new UserDto();
    Object.assign(userDto, mockUsers.usersCreate);

    const returnedValue = await authController.create(userDto);
    expect(createUser).toHaveBeenCalled();
    expect(returnedValue).toEqual(mockUsers.usersCreate[0]);
  });

  it('POST should return 403 when data to post is invalid', async () => {
    const createUser = AuthService.prototype.saveUser = jest.fn();
    createUser.mockImplementation(() => {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'The input data is invalid',
      }, HttpStatus.FORBIDDEN);
    });
    const userDto = new UserDto();
    Object.assign(userDto, mockUsers.usersCreate);

    try {
      await authController.create(userDto);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.response.error).toContain('The input data is invalid');
      expect(error.status).toBe(HttpStatus.FORBIDDEN);
    }

  });
});
