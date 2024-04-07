import { Test, TestingModule } from '@nestjs/testing';
import { MagnetsService } from './magnets.service';

describe('MagnetsService', () => {
  let service: MagnetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MagnetsService],
    }).compile();

    service = module.get<MagnetsService>(MagnetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
