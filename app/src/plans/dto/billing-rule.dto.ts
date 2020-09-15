import { IsString, IsInt, IsObject, IsIn, ValidateNested, IsOptional } from 'class-validator';
import { RecurringDto } from './recurring.dto';

export class BillingRuleDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsString()
  description: string;

  @IsInt()
  productId: number;

  @IsIn(["RECURRING", "ONE_TIME"])
  type: string;

  @ValidateNested()
  @IsOptional()
  recurring?: RecurringDto;

  @IsString()
  @IsOptional()
  tags?: string;

  @IsInt()
  @IsOptional()
  trialPeriodDays?: number;

  @IsString()
  @IsOptional()
  externalId?: string;

  @IsObject()
  @IsOptional()
  additionalInfo?: Object;

  @IsIn([0, 1])
  active: number;

}