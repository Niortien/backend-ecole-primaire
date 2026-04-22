import { PartialType } from '@nestjs/mapped-types';
import { CreateFraisScolariteDto } from './create-frais-scolarite.dto';
export class UpdateFraisScolariteDto extends PartialType(CreateFraisScolariteDto) {}
