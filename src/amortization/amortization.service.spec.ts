import { Test, TestingModule } from '@nestjs/testing';
import { AmortizationService } from './amortization.service';

describe('AmortizationService', () => {
  let service: AmortizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmortizationService],
    }).compile();

    service = module.get<AmortizationService>(AmortizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
