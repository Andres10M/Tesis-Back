import { Controller, Post, Body } from '@nestjs/common';
import { CreditService } from './credit.service';

@Controller('creditos')
export class CreditController {
  constructor(private readonly creditService: CreditService) {}

  @Post()
  create(@Body() body: any) {
    return this.creditService.createCredit(body);
  }
}
