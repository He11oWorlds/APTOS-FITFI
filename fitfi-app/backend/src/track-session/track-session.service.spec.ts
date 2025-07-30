import { Test, TestingModule } from '@nestjs/testing';
import { TrackSessionService } from './track-session.service';

describe('TrackSessionService', () => {
  let service: TrackSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrackSessionService],
    }).compile();

    service = module.get<TrackSessionService>(TrackSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
