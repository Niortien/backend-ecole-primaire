import { Controller, Get, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { RapportsService } from './rapports.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('rapports')
export class RapportsController {
  constructor(private readonly service: RapportsService) {}

  @Get('directeur')
  @Roles(UserRole.ADMIN, UserRole.DIRECTEUR)
  tableauDeBordDirecteur(@Query('anneeScolaireId', ParseIntPipe) anneeScolaireId: number) {
    return this.service.tableauDeBordDirecteur(anneeScolaireId);
  }

  @Get('comptable')
  @Roles(UserRole.ADMIN, UserRole.DIRECTEUR, UserRole.COMPTABLE)
  tableauDeBordComptable(@Query('anneeScolaireId', ParseIntPipe) anneeScolaireId: number) {
    return this.service.tableauDeBordComptable(anneeScolaireId);
  }

  @Get('absences')
  @Roles(UserRole.ADMIN, UserRole.DIRECTEUR, UserRole.MAITRE)
  absencesParMois(
    @Query('classeId', ParseIntPipe) classeId: number,
    @Query('annee', ParseIntPipe) annee: number,
  ) {
    return this.service.absencesParMois(classeId, annee);
  }
}
