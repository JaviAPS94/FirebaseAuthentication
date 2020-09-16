import { EntityManager } from 'typeorm';
import typeorm = require('typeorm');
import { Injectable } from '@nestjs/common';

@Injectable()
export class EntityManagerWrapperService {
  constructor(private connection: EntityManager = typeorm.getManager()) { }
}
