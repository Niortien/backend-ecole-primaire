import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { NiveauClasse, NomClasse } from '../classe.entity';

export class CreateClasseDto {
  @IsEnum(NomClasse)
  nom!: NomClasse;

  @IsString()
  @IsOptional()
  libelle?: string;

  @IsEnum(NiveauClasse)
  niveau!: NiveauClasse;

  @IsInt()
  @Min(1)
  @IsOptional()
  capacite?: number;

  @IsInt()
  anneeScolaireId!: number;
}
