import { HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mockUsers } from '../../../mock-user-data';
import { AuthController } from '../../../../src/auth/auth.controller';
import { AuthService } from '../../../../src/auth/auth.service';
import { JwtStrategy } from '../../../../src/auth/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../../../../src/users/users.module';
import { Oauth2Strategy } from '../../../../src/auth/strategies/oauth2.strategy';

describe('Oauth Strategy', () => {
  let oauthStrategy: Oauth2Strategy;

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

    oauthStrategy = module.get<Oauth2Strategy>(Oauth2Strategy);
  });

  it('should return a user', async () => {
    const getValidatedUser = AuthService.prototype.getValidatedUser = jest.fn();
    getValidatedUser.mockReturnValue(mockUsers.usersResult[0]);
    const userId = 1;
    const userSecret = "inmedical.dev@2020";
    const expectedResult = mockUsers.usersResult[0];
    const result = await oauthStrategy.validate(userId, userSecret);
    expect(result).toEqual(expectedResult);
  });

});
