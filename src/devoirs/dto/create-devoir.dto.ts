import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateDevoirDto {
  @IsString()
  titre!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  matiereId!: number;

  @IsInt()
  classeId!: number;

  @IsDateString()
  dateDonnee!: string;

  @IsDateString()
  @IsOptional()
  dateRendu?: string;
}
