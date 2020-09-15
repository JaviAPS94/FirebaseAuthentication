import { ArrayMinSize, ValidateNested } from 'class-validator';
import { PlanDto } from './plan.dto';
import { Type } from 'class-transformer';
import { FamilyPlanDto } from './family-plan.dto';

export class FamilyAndPlansDto {

  @ValidateNested({ each: true })
  @Type(() => PlanDto)
  @ArrayMinSize(1)
  plans: PlanDto[];

  @ValidateNested({ each: true })
  @Type(() => FamilyPlanDto)
  @ArrayMinSize(1)
  familyPlans: FamilyPlanDto[];
}
