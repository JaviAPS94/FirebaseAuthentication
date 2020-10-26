import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as _ from "lodash";
import { EntityManagerWrapperService } from '../../src/utils/entity-manager-wrapper.service';
import { getManager } from 'typeorm';
import { AccountService } from '../../src/account/account.service';
import { FirebaseService } from '../../src/firebase/firebase.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly accountService: AccountService) { }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async deleteExpiredToken() {
    this.logger.debug('begin');
    const wraperService = new EntityManagerWrapperService(getManager());
    const accounts = await this.accountService.findAll(wraperService);
    for (const account of accounts) {
      if (!_.isNull(account.credential)) {
        await this.firebaseService.deleteExpiredToken(account.id);
      }
    }
    this.logger.debug('end');
  }
}