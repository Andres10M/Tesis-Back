import { Controller, Get, Post, Body } from '@nestjs/common';
import { AporteService } from './aporte.service';
import { CreateAporteDto } from './dto/create-aporte.dto';

@Controller('aporte')
export class AporteController {
  constructor(private readonly aporteService: AporteService) {}

  @Post()
  create(@Body() dto: CreateAporteDto) {
    return this.aporteService.create(dto);
  }

  @Get()
  findAll() {
    return this.aporteService.findAll();
  }
}
