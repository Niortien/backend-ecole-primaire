import { PartialType } from '@nestjs/mapped-types';
import { CreateDevoirDto } from './create-devoir.dto';
export class UpdateDevoirDto extends PartialType(CreateDevoirDto) {}
