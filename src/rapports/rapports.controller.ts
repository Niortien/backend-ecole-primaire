import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { RapportsService } from './rapports.service';

@Controller('rapports')
export class RapportsController {
  constructor(private readonly service: RapportsService) {}

  @Get('directeur')
  tableauDeBordDirecteur(@Query('anneeScolaireId', ParseIntPipe) anneeScolaireId: number) {
    return this.service.tableauDeBordDirecteur(anneeScolaireId);
  }

  @Get('comptable')
  tableauDeBordComptable(@Query('anneeScolaireId', ParseIntPipe) anneeScolaireId: number) {
    return this.service.tableauDeBordComptable(anneeScolaireId);
  }

  @Get('absences')
  absencesParMois(
    @Query('classeId', ParseIntPipe) classeId: number,
    @Query('annee', ParseIntPipe) annee: number,
  ) {
    return this.service.absencesParMois(classeId, annee);
  }
}
