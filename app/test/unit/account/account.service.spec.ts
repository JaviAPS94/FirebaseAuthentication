import { Test, TestingModule } from '@nestjs/testing';
import { mockAccount } from '../../../test/mock-account-data';
import { AccountService } from '../../../src/account/account.service';
import { EntityManagerWrapperService } from '../../../src/utils/entity-manager-wrapper.service';

jest.mock('../../../src/utils/entity-manager-wrapper.service');

describe('AccountService', () => {
  let accountService: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      exports: [AccountService],
      providers: [AccountService]
    }).compile();

    accountService = module.get<AccountService>(AccountService);
  });

  it('should return all account', async () => {
    mockFindAccountsReturnedValue();
    const expectedResult = mockAccount.accounts[0];

    const wrapperService = new EntityManagerWrapperService();
    const result = await accountService.findAll(wrapperService);

    expect(result).toEqual(expectedResult);
  });

  it('should throw error when find all accounts', async () => {
    mockFindAccountsFailure();
    expect.assertions(2);

    try {
      const wrapperService = new EntityManagerWrapperService();
      await accountService.findAll(wrapperService);
    } catch (error) {
      expect(error.message).toContain('Find all accounts:');
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should return an account by id', async () => {
    mockFindAccountByIdReturnedValue();
    const expectedResult = mockAccount.accounts[0];
    const accountId = 1;
    const wrapperService = new EntityManagerWrapperService();
    const result = await accountService.findById(accountId, wrapperService);

    expect(result).toEqual(expectedResult);
  });

  it('should throw error when find account by id', async () => {
    mockFindAccountByIdFailure();
    expect.assertions(2);
    const accountId = 1;

    try {
      const wrapperService = new EntityManagerWrapperService();
      await accountService.findById(accountId, wrapperService);
    } catch (error) {
      expect(error.message).toContain('Account Find error:');
      expect(error).toBeInstanceOf(Error);
    }
  });

  const mockFindAccountsReturnedValue = () => {
    const findAccounts = EntityManagerWrapperService.prototype.findAccounts = jest.fn();
    findAccounts.mockReturnValue(mockAccount.accounts[0]);
  };

  const mockFindAccountsFailure = () => {
    const findAccounts = EntityManagerWrapperService.prototype.findAccounts = jest.fn();
    findAccounts.mockImplementation(() => { throw new Error('ANY.ERROR') });
  };

  const mockFindAccountByIdReturnedValue = () => {
    const findAccountById = EntityManagerWrapperService.prototype.findAccountById = jest.fn();
    findAccountById.mockReturnValue(mockAccount.accounts[0]);
  };

  const mockFindAccountByIdFailure = () => {
    const findAccountById = EntityManagerWrapperService.prototype.findAccountById = jest.fn();
    findAccountById.mockImplementation(() => { throw new Error('ANY.ERROR') });
  };
});