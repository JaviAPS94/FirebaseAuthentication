import { IsString, IsInt, IsObject, IsIn, IsOptional } from 'class-validator';

export class FamilyPlanDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsString()
  name: string;

  @IsString()
  externalId: string;

  @IsObject()
  @IsOptional()
  additionalInfo?: Object;

  @IsInt()
  accountId: number;

  @IsIn([0, 1])
  active: number;
}