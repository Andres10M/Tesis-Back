import { Test, TestingModule } from '@nestjs/testing';
import { CreditosEspecialesService } from './creditos-especiales.service';

describe('CreditosEspecialesService', () => {
  let service: CreditosEspecialesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreditosEspecialesService],
    }).compile();

    service = module.get<CreditosEspecialesService>(CreditosEspecialesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
