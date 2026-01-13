import { Test, TestingModule } from '@nestjs/testing';
import { PagoMultaController } from './pago-multa.controller';

describe('PagoMultaController', () => {
  let controller: PagoMultaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PagoMultaController],
    }).compile();

    controller = module.get<PagoMultaController>(PagoMultaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
