import { Test, TestingModule } from '@nestjs/testing';
import { AporteService } from './aporte.service';

describe('AporteService', () => {
  let service: AporteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AporteService],
    }).compile();

    service = module.get<AporteService>(AporteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
