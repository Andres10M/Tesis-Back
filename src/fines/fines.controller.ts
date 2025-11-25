import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { FinesService } from './fines.service';
import { CreateFineDto } from './dto/create-fine.dto';
import { UpdateFineDto } from './dto/update-fine.dto';

@Controller('fines')
export class FinesController {
  constructor(private readonly finesService: FinesService) {}

  @Post()
  create(@Body() createFineDto: CreateFineDto) {
    return this.finesService.create(createFineDto);
  }

  @Get()
  findAll() {
    return this.finesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.finesService.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateFineDto: UpdateFineDto) {
    return this.finesService.update(Number(id), updateFineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.finesService.remove(Number(id));
  }
}
