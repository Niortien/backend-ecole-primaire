import { IsDateString, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { TypeExamen } from '../examen.entity';

export class CreateExamenDto {
  @IsString()
  libelle!: string;

  @IsEnum(TypeExamen)
  type!: TypeExamen;

  @IsInt()
  classeId!: number;

  @IsInt()
  @IsOptional()
  matiereId?: number;

  @IsDateString()
  date!: string;

  @IsInt()
  @IsOptional()
  dureeMinutes?: number;

  @IsInt()
  anneeScolaireId!: number;
}
