import { Test, TestingModule } from '@nestjs/testing';
import { BoardgameService } from './boardgame.service';

describe('BoardgameService', () => {
  let service: BoardgameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoardgameService],
    }).compile();

    service = module.get<BoardgameService>(BoardgameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
