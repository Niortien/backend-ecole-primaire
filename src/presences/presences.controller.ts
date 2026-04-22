import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { PresencesService } from './presences.service';
import { AppelClasseDto } from './dto/create-presence.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('presences')
export class PresencesController {
  constructor(private readonly service: PresencesService) {}

  @Post('appel')
  @Roles(UserRole.MAITRE, UserRole.DIRECTEUR, UserRole.ADMIN)
  enregistrerAppel(@Body() dto: AppelClasseDto, @Request() req: any) {
    return this.service.enregistrerAppel(dto, req.user.id);
  }

  @Get('classe/:classeId')
  @Roles(UserRole.MAITRE, UserRole.DIRECTEUR, UserRole.ADMIN)
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
  @Roles(UserRole.MAITRE, UserRole.DIRECTEUR, UserRole.ADMIN)
  statsAbsences(
    @Param('classeId', ParseIntPipe) classeId: number,
    @Query('anneeScolaireId', ParseIntPipe) anneeScolaireId: number,
  ) {
    return this.service.statsAbsences(classeId, anneeScolaireId);
  }
}
