import { IsDateString, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Sexe } from '../eleve.entity';

export class CreateEleveDto {
  @IsString()
  nom!: string;

  @IsString()
  prenom!: string;

  @IsDateString()
  dateNaissance!: string;

  @IsString()
  @IsOptional()
  lieuNaissance?: string;

  @IsEnum(Sexe)
  sexe!: Sexe;

  @IsString()
  @IsOptional()
  numeroDossier?: string;

  @IsInt()
  @IsOptional()
  classeId?: number;

  @IsInt()
  @IsOptional()
  parentId?: number;
}
