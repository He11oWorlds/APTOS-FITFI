// track-session.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { TrackSessionService } from './track-session.service';
import { CreateTrackSessionDto } from './dto/create-track-session.dto';

@Controller('track-session')
export class TrackSessionController {
  constructor(private readonly trackSessionService: TrackSessionService) {}

  @Post()
async createTrackSession(@Body() dto: CreateTrackSessionDto) {
  return this.trackSessionService.create(dto);
}

}
