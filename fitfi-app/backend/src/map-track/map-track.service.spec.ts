import { Test, TestingModule } from '@nestjs/testing';
import { MapTrackService } from './map-track.service';

describe('MapTrackService', () => {
  let service: MapTrackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MapTrackService],
    }).compile();

    service = module.get<MapTrackService>(MapTrackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
