import { IsNumber, Min } from 'class-validator';

export class UpdateProgressDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  quest_id: number;

  @IsNumber()
  @Min(0)
  progress: number; // should be a percentage between 0–100
}
