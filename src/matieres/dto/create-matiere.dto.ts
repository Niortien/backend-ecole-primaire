import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { NiveauMatiere } from '../matiere.entity';

export class CreateMatiereDto {
  @IsString()
  nom!: string;

  @IsString()
  code!: string;

  @IsNumber()
  @Min(0.5)
  @IsOptional()
  coefficient?: number;

  @IsEnum(NiveauMatiere)
  @IsOptional()
  niveau?: NiveauMatiere;
}
