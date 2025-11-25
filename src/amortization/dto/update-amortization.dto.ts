import { PartialType } from '@nestjs/mapped-types';
import { CreateAmortizationDto } from './create-amortization.dto';

export class UpdateAmortizationDto extends PartialType(CreateAmortizationDto) {}
