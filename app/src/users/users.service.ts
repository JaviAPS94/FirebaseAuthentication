import { Injectable } from '@nestjs/common';
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
      console.log("ERROR: User Find error:" + error.message);
      throw new Error("User Find error: " + error.message);
    }
  }

  // public async save(user: DeepPartial<User>): Promise<any> {
  //   return this.userRepository.save(user);
  // }
}
