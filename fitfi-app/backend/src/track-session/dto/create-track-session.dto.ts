import { IsDateString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateTrackSessionDto {
  @IsNotEmpty()
  user_id: bigint;

  @IsNotEmpty()
  quest_id: bigint;

  @IsDateString()
  started_at: string;

  @IsDateString()
  ended_at: string;

  @IsObject()
  gpx_data: any;

  @IsOptional()
  notes?: string;
}
