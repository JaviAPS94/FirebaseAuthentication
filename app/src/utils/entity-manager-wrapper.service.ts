import { EntityManager } from 'typeorm';
import typeorm = require('typeorm');
import { Injectable } from '@nestjs/common';
import { User } from '../../src/entity/User';

@Injectable()
export class EntityManagerWrapperService {
  constructor(private connection: EntityManager = typeorm.getManager()) { }

  public async findUserById(sentence: {}) {
    return await this.connection.getRepository(User).findOne(sentence);
  }

  public async save(entity: any) {
    return await this.connection.save(entity);
  }
}
