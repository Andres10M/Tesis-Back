import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  create(@Body() dto: CreateAttendanceDto) {
    return this.attendanceService.create(dto);
  }

  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  // 👉 PATCH /attendance/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.attendanceService.update(Number(id), dto);
  }

  // 👉 DELETE /attendance/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(Number(id));
  }
}
