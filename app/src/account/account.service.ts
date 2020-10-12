import { Injectable } from '@nestjs/common';
import { EntityManagerWrapperService } from 'src/utils/entity-manager-wrapper.service';


@Injectable()
export class AccountService {
  constructor() { }

  public async findAll(connection: EntityManagerWrapperService) {
    try {
      return await connection.findAccounts({
        relations: ["credential"]
      });
    }
    catch (error) {
      throw new Error("Find all accounts: " + error.message);
    }
  }

  public async findById(accountId: number, connection: EntityManagerWrapperService) {
    try {
      return await connection.findAccountById({
        where: { id: `${accountId}` }
      });
    }
    catch (error) {
      console.log("ERROR: Account Find error:" + error.message);
      throw new Error("Account Find error: " + error.message);
    }
  }
}