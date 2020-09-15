import { IsString, IsInt, IsObject, IsIn, IsOptional, ValidateNested, ArrayMinSize } from 'class-validator';
import { BillingRuleDto } from './billing-rule.dto';
import { Type } from 'class-transformer';

export class PlanDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  externalId?: string;

  @IsString()
  externalFamily: string;

  @IsOptional()
  @IsObject()
  additionalInfo?: Object;

  @IsIn([0, 1])
  active: number;
  
  @ValidateNested({ each: true })
  @Type(() => BillingRuleDto)
  @ArrayMinSize(1)
  billingRules: BillingRuleDto[];
}
