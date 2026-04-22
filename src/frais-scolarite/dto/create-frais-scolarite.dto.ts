import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateFraisScolariteDto {
  @IsString()
  libelle!: string;

  @IsNumber()
  @Min(0)
  montant!: number;

  @IsInt()
  @IsOptional()
  classeId?: number;

  @IsInt()
  anneeScolaireId!: number;

  @IsBoolean()
  @IsOptional()
  obligatoire?: boolean;

  @IsString()
  @IsOptional()
  description?: string;
}
