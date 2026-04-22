import { Controller, Get, Post, Patch, Body, Param, Query, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { PaiementsService } from './paiements.service';
import { CreatePaiementDto } from './dto/create-paiement.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('paiements')
export class PaiementsController {
  constructor(private readonly service: PaiementsService) {}

  @Post()
  @Roles(UserRole.COMPTABLE, UserRole.ADMIN, UserRole.DIRECTEUR)
  create(@Body() dto: CreatePaiementDto, @Request() req: any) {
    return this.service.create(dto, req.user.id);
  }

  @Get()
  @Roles(UserRole.COMPTABLE, UserRole.ADMIN, UserRole.DIRECTEUR)
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
  @Roles(UserRole.COMPTABLE, UserRole.ADMIN)
  annuler(@Param('id', ParseIntPipe) id: number) {
    return this.service.annuler(id);
  }
}
