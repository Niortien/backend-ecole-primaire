import { IsDateString, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateMaitreDto {
  @IsString()
  nom!: string;

  @IsString()
  prenom!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @IsOptional()
  telephone?: string;

  @IsString()
  @IsOptional()
  diplome?: string;

  @IsString()
  @IsOptional()
  specialite?: string;

  @IsDateString()
  @IsOptional()
  dateEmbauche?: string;
}
