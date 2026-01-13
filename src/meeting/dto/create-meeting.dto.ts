import { IsDateString } from 'class-validator';

export class CreateMeetingDto {
  @IsDateString()
  fecha: string;
}
