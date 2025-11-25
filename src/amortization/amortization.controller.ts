import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AmortizationService } from './amortization.service';
import { CreateAmortizationDto } from './dto/create-amortization.dto';
import { UpdateAmortizationDto } from './dto/update-amortization.dto';

@Controller('amortizations')
export class AmortizationController {
  constructor(private readonly amortizationService: AmortizationService) {}

  @Post()
  create(@Body() dto: CreateAmortizationDto) {
    return this.amortizationService.create(dto);
  }

  @Get()
  findAll() {
    return this.amortizationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.amortizationService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAmortizationDto) {
    return this.amortizationService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.amortizationService.remove(Number(id));
  }
}
