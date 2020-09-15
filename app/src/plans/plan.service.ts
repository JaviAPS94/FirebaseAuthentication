import { Injectable } from 'test/e2e/plans/node_modules/@nestjs/common';
import { Plan } from '../entity/Plan';
import * as _ from 'lodash';
import { familyPlanService } from './family-plan.service';
import { EntityManagerWrapperService } from '../utils/entity-manager-wrapper.service';
import { getManager } from 'typeorm';
import { FamilyAndPlansDto } from './dto/family-and-plans.dto';
import { PlanDto } from './dto/plan.dto';

@Injectable()
export class PlanService {
  public async updatePlanById(id: number, planForUpdateDto: PlanDto) {
    const wraperService = new EntityManagerWrapperService(getManager());
    var plan = await this.findPlanById(id, wraperService);
    Object.assign(plan, planForUpdateDto);
    return await this.updatePlan(plan, wraperService);
  }

  public async updatePlan(plan: Plan, connection: EntityManagerWrapperService) {
    try {
      return await connection.save(plan);
    }
    catch (error) {
      console.log("ERROR: Update Plan Database Error: " + error.message);
      throw new Error("Update Plan Database Error: " + error.message);
    }
  }

  public async findPlanById(id: number, connection: EntityManagerWrapperService) {
    try {
      return await connection.findPlanById({
        where: { id: `${id}` },
        relations: ["billingRules", "billingRules.recurringBillingRule"]
      });
    }
    catch (error) {
      console.log("ERROR: PlanById Find error: " + error.message);
      throw new Error("PlanById Find error: " + error.message);
    }
  }

  public async createPlans(dataToCreate: FamilyAndPlansDto) {
    var planIds: any;
    await getManager().transaction(async transactionalEntityManager => {
      const wraperService = new EntityManagerWrapperService(transactionalEntityManager);
      await familyPlanService.createBatch(dataToCreate.familyPlans, wraperService);
      planIds = await this.createBatch(dataToCreate.plans, wraperService);
    });
    return planIds;
  }

  public async createBatch(plans: PlanDto[], connection: EntityManagerWrapperService) {
    if (_.isUndefined(plans)) {
      return [];
    }
    const promises = plans.map((plan: PlanDto) => this.create(plan, connection));
    const result = await Promise.all(promises);
    return result;
  }

  public async create(plan: PlanDto, connection: EntityManagerWrapperService) {
    var newPlan = new Plan();
    Object.assign(newPlan, plan);
    try {
      const familyPlan = await familyPlanService.findByExternalId(plan.externalFamily, connection);
      if (_.isEmpty(familyPlan)) {
        console.log('ERROR: Plan needs a VALID FamilyPlanId');
        throw new Error('Plan needs a VALID FamilyPlanId');
      }
      newPlan.familyPlanId = familyPlan[0].id;
      const planReturned = await connection.save(newPlan);
      return planReturned;
    } catch (error) {
      throw new Error('Plan Database Error: ' + error.message);
    }
  }

  public async getPlansByFamilyId(familyId: number) {
    const wraperService = new EntityManagerWrapperService(getManager());
    return await this.findPlansByFamilyId(familyId, wraperService);
  }

  public async findPlansByFamilyId(familyId: number, connection: EntityManagerWrapperService) {
    try {
      return await connection.findPlansByFamilyId({
        where: { familyPlanId: `${familyId}` },
        relations: ["billingRules", "billingRules.recurringBillingRule"]
      });
    }
    catch (error) {
      console.log("ERROR: FamilyPlan Find error:" + error.message);
      throw new Error("FamilyPlan Find error: " + error.message);
    }
  }
}

export const planService = new PlanService();
