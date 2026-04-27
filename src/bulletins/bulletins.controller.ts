import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { BulletinsService } from './bulletins.service';
import { GenererBulletinsDto } from './dto/generer-bulletins.dto';
import { Periode } from '../notes/note.entity';

@Controller('bulletins')
export class BulletinsController {
  constructor(private readonly service: BulletinsService) {}

  @Post('generer')
  generer(@Body() dto: GenererBulletinsDto) {
    return this.service.genererBulletins(dto.classeId, dto.anneeScolaireId, dto.periode);
  }

  @Get('classe/:classeId')
  findByClasse(
    @Param('classeId', ParseIntPipe) classeId: number,
    @Query('anneeScolaireId', ParseIntPipe) anneeScolaireId: number,
    @Query('periode') periode: Periode,
  ) {
    return this.service.findByClasse(classeId, anneeScolaireId, periode);
  }

  @Get('eleve/:eleveId')
  findByEleve(
    @Param('eleveId', ParseIntPipe) eleveId: number,
    @Query('anneeScolaireId', ParseIntPipe) anneeScolaireId: number,
  ) {
    return this.service.findByEleve(eleveId, anneeScolaireId);
  }

  @Patch(':id/publier')
  publier(@Param('id', ParseIntPipe) id: number) {
    return this.service.publier(id);
  }
}
