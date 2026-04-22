import { IsDateString, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { StatutPresence } from '../presence.entity';

export class CreatePresenceDto {
  @IsInt()
  eleveId!: number;

  @IsInt()
  classeId!: number;

  @IsDateString()
  date!: string;

  @IsEnum(StatutPresence)
  statut!: StatutPresence;

  @IsString()
  @IsOptional()
  motif?: string;
}

export class AppelClasseDto {
  @IsInt()
  classeId!: number;

  @IsDateString()
  date!: string;

  presences!: { eleveId: number; statut: StatutPresence; motif?: string }[];
}
