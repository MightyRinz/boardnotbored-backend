import { Test, TestingModule } from '@nestjs/testing';
import { BoardgameController } from './boardgame.controller';

describe('BoardgameController', () => {
  let controller: BoardgameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardgameController],
    }).compile();

    controller = module.get<BoardgameController>(BoardgameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
