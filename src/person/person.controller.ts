import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Controller('person')
export class PersonController {
  constructor(private readonly service: PersonService) {}

  // ==================================================
  // TODOS LOS SOCIOS (SE MANTIENE)
  // ==================================================
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // ==================================================
  // 🔥 AUTOCOMPLETADO POR NOMBRE / APELLIDO
  // /person/search?q=juan
  // ==================================================
  @Get('search')
  search(@Query('q') q: string) {
    return this.service.searchByName(q);
  }

  // ==================================================
  // CREAR SOCIO (SE MANTIENE)
  // ==================================================
  @Post()
  create(@Body() dto: CreatePersonDto) {
    return this.service.create(dto);
  }

  // ==================================================
  // ACTUALIZAR SOCIO (SE MANTIENE)
  // ==================================================
  @Patch(':nui')
  update(@Param('nui') nui: string, @Body() dto: UpdatePersonDto) {
    return this.service.updateSafe(nui, dto);
  }

  // ==================================================
  // ELIMINAR SOCIO (SE MANTIENE)
  // ==================================================
  @Delete(':nui')
  remove(@Param('nui') nui: string) {
    return this.service.remove(nui);
  }
}
