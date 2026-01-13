import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('cuenta/:id')
  findByCuenta(@Param('id') id: string) {
    return this.service.findByCuenta(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
