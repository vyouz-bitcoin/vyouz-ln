import { Test, TestingModule } from '@nestjs/testing';
import { LnController } from './ln.controller';

describe('LnController', () => {
  let controller: LnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LnController],
    }).compile();

    controller = module.get<LnController>(LnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
