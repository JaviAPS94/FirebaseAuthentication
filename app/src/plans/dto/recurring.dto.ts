import { IsInt, IsIn, IsOptional } from 'class-validator';

export class RecurringDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsIn(["LICENSED", "METERED"])
  usageType: string;

  @IsOptional()
  @IsIn(["DAY", "WEEK", "MONTH", "YEAR"])
  interval?: string;

  @IsOptional()
  @IsInt()
  intervalCount?: string;
}
