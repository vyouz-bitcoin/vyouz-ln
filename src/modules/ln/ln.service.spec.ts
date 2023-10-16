import { Test, TestingModule } from '@nestjs/testing';
import { LnService } from './ln.service';

describe('LnService', () => {
  let service: LnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LnService],
    }).compile();

    service = module.get<LnService>(LnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
