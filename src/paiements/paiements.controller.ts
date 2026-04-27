import { Controller, Get, Post, Patch, Body, Param, Query, ParseIntPipe, Request } from '@nestjs/common';
import { PaiementsService } from './paiements.service';
import { CreatePaiementDto } from './dto/create-paiement.dto';

@Controller('paiements')
export class PaiementsController {
  constructor(private readonly service: PaiementsService) {}

  @Post()
  create(@Body() dto: CreatePaiementDto, @Request() req: any) {
    return this.service.create(dto, req.user.id);
  }

  @Get()
  findAll(@Query('dateDebut') dateDebut?: string, @Query('dateFin') dateFin?: string) {
    return this.service.findAll(dateDebut, dateFin);
  }

  @Get('eleve/:eleveId')
  findByEleve(@Param('eleveId', ParseIntPipe) eleveId: number) {
    return this.service.findByEleve(eleveId);
  }

  @Get('eleve/:eleveId/situation')
  situationEleve(
    @Param('eleveId', ParseIntPipe) eleveId: number,
    @Query('anneeScolaireId', ParseIntPipe) anneeScolaireId: number,
  ) {
    return this.service.situationEleve(eleveId, anneeScolaireId);
  }

  @Patch(':id/annuler')
  annuler(@Param('id', ParseIntPipe) id: number) {
    return this.service.annuler(id);
  }
}
