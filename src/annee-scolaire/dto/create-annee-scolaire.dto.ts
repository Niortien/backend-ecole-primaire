import { IsBoolean, IsDateString, IsOptional, IsString, Matches } from 'class-validator';

export class CreateAnneeScolaireDto {
  @IsString()
  @Matches(/^\d{4}-\d{4}$/, { message: 'Format attendu: YYYY-YYYY (ex: 2025-2026)' })
  libelle!: string;

  @IsDateString()
  dateDebut!: string;

  @IsDateString()
  dateFin!: string;

  @IsBoolean()
  @IsOptional()
  estActive?: boolean;
}
