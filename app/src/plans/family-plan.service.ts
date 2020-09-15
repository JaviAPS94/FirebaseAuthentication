import { Injectable } from '@nestjs/common';
import { FamilyPlan } from '../entity/FamilyPlan';
import * as _ from 'lodash';
import { EntityManagerWrapperService } from '../utils/entity-manager-wrapper.service';
import { FamilyPlanDto } from './dto/family-plan.dto';

@Injectable()
export class FamilyPlanService {
  public async create(familyPlan: FamilyPlanDto, connection: EntityManagerWrapperService) {
    const newFamilyPlan = new FamilyPlan();
    Object.assign(newFamilyPlan, familyPlan);
    try {
      return await connection.save(newFamilyPlan);
    } catch (error) {
      throw new Error('FamilyPlan Database Error: ' + error.message);
    }
  }

  public async createBatch(familyPlans: FamilyPlanDto[], connection: EntityManagerWrapperService) {
    if (_.isUndefined(familyPlans)) {
      return [];
    }
    const promises = familyPlans.map((familyPlan: FamilyPlanDto) => this.create(familyPlan, connection));
    const result = await Promise.all(promises);
    return _(result).map("id").value();
  }
}

export const familyPlanService = new FamilyPlanService();