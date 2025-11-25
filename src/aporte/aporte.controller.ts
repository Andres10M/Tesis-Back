import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AporteService } from './aporte.service';
import { CreateAporteDto } from './dto/create-aporte.dto';
import { UpdateAporteDto } from './dto/update-aporte.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aporteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAporteDto) {
    return this.aporteService.update(+id, dto);
  }

 @Delete(':id')
remove(@Param('id') id: string) {
  return this.aporteService.remove(+id);
}

}
