import { PartialType } from '@nestjs/mapped-types';
import { CreateMaitreDto } from './create-maitre.dto';

export class UpdateMaitreDto extends PartialType(CreateMaitreDto) {}
