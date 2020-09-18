import { IsInt } from 'class-validator';

export class DummyDto {
  @IsInt()
  id: number;
}
