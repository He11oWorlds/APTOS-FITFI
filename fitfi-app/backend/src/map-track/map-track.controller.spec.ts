import { Test, TestingModule } from '@nestjs/testing';
import { MapTrackController } from './map-track.controller';

describe('MapTrackController', () => {
  let controller: MapTrackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MapTrackController],
    }).compile();

    controller = module.get<MapTrackController>(MapTrackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
