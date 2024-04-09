import { Test, TestingModule } from '@nestjs/testing';
import { MagnetsController } from './magnets.controller';
import { MagnetsService } from '../service/magnets.service';

describe('MagnetsController', () => {
  let controller: MagnetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MagnetsController],
      providers: [MagnetsService],
    }).compile();

    controller = module.get<MagnetsController>(MagnetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
