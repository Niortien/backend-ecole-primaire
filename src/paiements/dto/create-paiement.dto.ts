import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ModePaiement } from '../paiement.entity';

export class CreatePaiementDto {
  @IsInt()
  eleveId!: number;

  @IsInt()
  fraisScolariteId!: number;

  @IsNumber()
  @Min(0)
  montant!: number;

  @IsDateString()
  datePaiement!: string;

  @IsEnum(ModePaiement)
  @IsOptional()
  modePaiement?: ModePaiement;

  @IsString()
  @IsOptional()
  referencePaiement?: string;

  @IsString()
  @IsOptional()
  commentaire?: string;
}
