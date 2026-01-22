import { Test, TestingModule } from '@nestjs/testing';
import { CreditosEspecialesController } from './creditos-especiales.controller';

describe('CreditosEspecialesController', () => {
  let controller: CreditosEspecialesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreditosEspecialesController],
    }).compile();

    controller = module.get<CreditosEspecialesController>(CreditosEspecialesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
