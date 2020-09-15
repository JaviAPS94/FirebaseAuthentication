import { Injectable } from 'test/e2e/plans/node_modules/@nestjs/common';
import { EntityManager } from 'typeorm';
import typeorm = require('typeorm');
import { FamilyPlan } from '../entity/FamilyPlan';
import { Subscription } from '../entity/Subscription';
import { SubscriptionUser } from '../entity/SubscriptionUser';
import { Plan } from '../entity/Plan';

@Injectable()
export class EntityManagerWrapperService {
  constructor(private connection: EntityManager = typeorm.getManager()) { }

  public async save(entity: any) {
    return await this.connection.save(entity);
  }
  public async findFamily(sentence: any) {
    return await this.connection.getRepository(FamilyPlan).find(sentence);
  }

  public async findPlansByFamilyId(sentence: {}) {
    return await this.connection.getRepository(Plan).find(sentence);
  }

  public async findPlanById(sentence: {}) {
    return await this.connection.getRepository(Plan).findOne(sentence);
  }

  public async findAllSubscriptionsByUID(uidParam: string) {
    const usersSubscription = await this.connection.getRepository(SubscriptionUser)
      .createQueryBuilder("subscription-user")
      .select("subscription-user.subscriptionId")
      .where("subscription-user.uid = :uid", { uid: uidParam });

    const subscriptions = await this.connection.getRepository(Subscription)
      .createQueryBuilder("subscription")
      .leftJoinAndSelect("subscription.subscriptionItems", "subscription-item")
      .leftJoinAndSelect("subscription.subscriptionUsers", "subscription-user")
      .where("subscription.id IN (" + usersSubscription.getQuery() + ")")
      .setParameters(usersSubscription.getParameters())
      .getMany();

    return subscriptions;
  }

  public async findSubscriptionById(subscriptionID: any) {
    return await this.connection.getRepository(Subscription).findOne(subscriptionID);
  }

  public async saveSubscription(entity: any) {
    return await this.connection.save(entity);
  }
}
