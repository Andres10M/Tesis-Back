import { Test, TestingModule } from '@nestjs/testing';
import { AporteController } from './aporte.controller';
import { AporteService } from './aporte.service';

describe('AporteController', () => {
  let controller: AporteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AporteController],
      providers: [AporteService],
    }).compile();

    controller = module.get<AporteController>(AporteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
