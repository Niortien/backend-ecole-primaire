import { IsEnum, IsInt } from 'class-validator';
import { Periode } from '../../notes/note.entity';

export class GenererBulletinsDto {
  @IsInt()
  classeId!: number;

  @IsInt()
  anneeScolaireId!: number;

  @IsEnum(Periode)
  periode!: Periode;
}
