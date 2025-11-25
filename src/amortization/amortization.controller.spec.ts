import { Test, TestingModule } from '@nestjs/testing';
import { AmortizationController } from './amortization.controller';
import { AmortizationService } from './amortization.service';

describe('AmortizationController', () => {
  let controller: AmortizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AmortizationController],
      providers: [AmortizationService],
    }).compile();

    controller = module.get<AmortizationController>(AmortizationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
