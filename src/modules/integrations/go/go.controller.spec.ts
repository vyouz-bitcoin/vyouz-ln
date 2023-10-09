import { Test, TestingModule } from '@nestjs/testing';
import { GoController } from './go.controller';

describe('GoController', () => {
  let controller: GoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoController],
    }).compile();

    controller = module.get<GoController>(GoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
