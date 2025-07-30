import { Module } from '@nestjs/common';
import { MapTrackService } from './map-track.service';
import { MapTrackController } from './map-track.controller';

@Module({
  providers: [MapTrackService],
  controllers: [MapTrackController]
})
export class MapTrackModule {}
