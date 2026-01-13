import { Test, TestingModule } from '@nestjs/testing';
import { PagoMultaService } from './pago-multa.service';

describe('PagoMultaService', () => {
  let service: PagoMultaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PagoMultaService],
    }).compile();

    service = module.get<PagoMultaService>(PagoMultaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
