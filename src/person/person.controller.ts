import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  create(@Body() dto: CreatePersonDto) {
    return this.personService.create(dto);
  }

  @Get()
  findAll() {
    return this.personService.findAll();
  }

  @Get(':nui')
  findOne(@Param('nui') nui: string) {
    return this.personService.findOne(nui);
  }

  @Patch(':nui')
  update(@Param('nui') nui: string, @Body() dto: UpdatePersonDto) {
    return this.personService.update(nui, dto);
  }

  @Delete(':nui')
  remove(@Param('nui') nui: string) {
    return this.personService.remove(nui);
  }
}
