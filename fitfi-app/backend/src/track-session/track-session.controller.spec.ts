import { Test, TestingModule } from '@nestjs/testing';
import { TrackSessionController } from './track-session.controller';

describe('TrackSessionController', () => {
  let controller: TrackSessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackSessionController],
    }).compile();

    controller = module.get<TrackSessionController>(TrackSessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
