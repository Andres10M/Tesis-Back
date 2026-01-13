import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @Get('meeting/:id')
  findByMeeting(@Param('id', ParseIntPipe) id: number) {
    return this.service.findByMeeting(id);
  }

  @Get('meeting/:id/resumen')
  getResumen(@Param('id', ParseIntPipe) id: number) {
    return this.service.getResumen(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAttendanceDto,
  ) {
    return this.service.update(id, dto);
  }

  @Post('meeting/:id/close')
  close(@Param('id', ParseIntPipe) id: number) {
    return this.service.closeMeeting(id);
  }
}
