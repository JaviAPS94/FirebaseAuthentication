import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Credential } from '../../src/entity/Credential';
import { User } from '../../src/entity/User';
import typeorm = require('typeorm');

@Injectable()
export class EntityManagerWrapperService {
  constructor(private connection: EntityManager = typeorm.getManager()) { }

  public async findUserById(sentence: {}) {
    return await this.connection.getRepository(User).findOne(sentence);
  }

  public async findCrendentialByAccountId(sentence: {}) {
    return await this.connection.getRepository(Credential).findOne(sentence);
  }

  public async save(entity: any) {
    return await this.connection.save(entity);
  }
}
