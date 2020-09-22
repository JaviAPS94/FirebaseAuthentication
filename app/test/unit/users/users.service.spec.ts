import { Test, TestingModule } from '@nestjs/testing';
import { EntityManagerWrapperService } from '../../../src/utils/entity-manager-wrapper.service';
import { UsersService } from '../../../src/users/users.service';
import { mockUsers } from '../../mock-user-data';
import { User } from '../../../src/entity/User';

jest.mock('../../../src/utils/entity-manager-wrapper.service');

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      exports: [UsersService],
      providers: [UsersService]
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('should return a user by userId', async () => {
    mockFindByUserIdReturnedValue();
    const userId = 1;
    const expectedResult = mockUsers.users[0];
    const wrapperService = new EntityManagerWrapperService();
    const result = await usersService.findUserById(userId, wrapperService);
    expect(result).toEqual(expectedResult);
  });

  it('should throw error when find ById fails', async () => {
    mockFindByIdFailure();
    const userId = 1;
    expect.assertions(2);

    try {
      const wrapperService = new EntityManagerWrapperService();
      await usersService.findUserById(userId, wrapperService);
    } catch (error) {
      expect(error.message).toContain('User Find error:');
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should insert a user in db', async () => {
    mockCreateUserSuccessful();
    const dataToCreate = new User();
    Object.assign(dataToCreate, mockUsers.usersCreate[0]);
    const expectedResult = new User();
    Object.assign(expectedResult, mockUsers.users[0]);

    const wrapperService = new EntityManagerWrapperService();
    const result =  await usersService.save(dataToCreate, wrapperService);
    
    expect(result).toEqual(expectedResult);
  });

  const mockFindByUserIdReturnedValue = () => {
    const findByUserId = EntityManagerWrapperService.prototype.findUserById = jest.fn();
    findByUserId.mockReturnValue(mockUsers.users[0]);
  };

  const mockFindByIdFailure = () => {
    const findByUserId = EntityManagerWrapperService.prototype.findUserById = jest.fn();
    findByUserId.mockImplementation(() => { throw new Error('ANY.ERROR') });
  };

  const mockCreateUserSuccessful = () => {
    const returnedUser = new User();
    Object.assign(returnedUser, mockUsers.users[0]);
    const save = EntityManagerWrapperService.prototype.save = jest.fn();
    save.mockReturnValue(returnedUser);
  };
});
