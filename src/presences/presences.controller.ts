import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { PresencesService } from './presences.service';
import { AppelClasseDto } from './dto/create-presence.dto';

@Controller('presences')
export class PresencesController {
  constructor(private readonly service: PresencesService) {}

  @Post('appel')
  enregistrerAppel(@Body() dto: AppelClasseDto, @Request() req: any) {
    return this.service.enregistrerAppel(dto, req.user.id);
  }

  @Get('classe/:classeId')
  findByClasse(
    @Param('classeId', ParseIntPipe) classeId: number,
    @Query('date') date?: string,
  ) {
    return this.service.findByClasse(classeId, date);
  }

  @Get('eleve/:eleveId')
  findByEleve(
    @Param('eleveId', ParseIntPipe) eleveId: number,
    @Query('mois') mois?: string,
  ) {
    return this.service.findByEleve(eleveId, mois);
  }

  @Get('stats/classe/:classeId')
  statsAbsences(
    @Param('classeId', ParseIntPipe) classeId: number,
    @Query('anneeScolaireId', ParseIntPipe) anneeScolaireId: number,
  ) {
    return this.service.statsAbsences(classeId, anneeScolaireId);
  }
}
