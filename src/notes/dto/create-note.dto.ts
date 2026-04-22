import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Periode } from '../note.entity';

export class CreateNoteDto {
  @IsInt()
  eleveId!: number;

  @IsInt()
  matiereId!: number;

  @IsInt()
  classeId!: number;

  @IsInt()
  anneeScolaireId!: number;

  @IsEnum(Periode)
  periode!: Periode;

  @IsNumber()
  @Min(0)
  @Max(20)
  valeur!: number;

  @IsString()
  @IsOptional()
  observation?: string;
}
