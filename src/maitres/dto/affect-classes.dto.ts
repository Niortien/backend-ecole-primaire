import { IsArray, IsInt } from 'class-validator';

export class AffectClassesDto {
  @IsArray()
  @IsInt({ each: true })
  classeIds!: number[];
}
