import { Injectable } from '@nestjs/common';
import { User } from '../../src/entity/User';
import { EntityManagerWrapperService } from '../../src/utils/entity-manager-wrapper.service';

@Injectable()
export class UsersService {
  public async findUserById(userId: number, connection: EntityManagerWrapperService) {
    try {
      return await connection.findUserById({
        where: { id: `${userId}` }
      });
    }
    catch (error) {
      throw new Error("User Find error: " + error.message);
    }
  }

  public async save(user: User, connection: EntityManagerWrapperService): Promise<any> {
    try {
      const userReturned = await connection.save(user);
      return userReturned;
    } catch (error) {
      throw new Error('User Database Error: ' + error.message);
    }
  }
}
