import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Controller('person')
export class PersonController {
  constructor(private readonly service: PersonService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: CreatePersonDto) {
    return this.service.create(dto);
  }

  @Patch(':nui')
  update(@Param('nui') nui: string, @Body() dto: UpdatePersonDto) {
    return this.service.updateSafe(nui, dto);
  }

  @Delete(':nui')
  remove(@Param('nui') nui: string) {
    return this.service.remove(nui);
  }
}
