import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { CategorieDepense } from '../depense.entity';

export class CreateDepenseDto {
  @IsString()
  libelle!: string;

  @IsNumber()
  @Min(0)
  montant!: number;

  @IsEnum(CategorieDepense)
  @IsOptional()
  categorie?: CategorieDepense;

  @IsDateString()
  date!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  justificatif?: string;
}
