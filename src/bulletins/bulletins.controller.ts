import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { BulletinsService } from './bulletins.service';
import { GenererBulletinsDto } from './dto/generer-bulletins.dto';
import { Periode } from '../notes/note.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bulletins')
export class BulletinsController {
  constructor(private readonly service: BulletinsService) {}

  @Post('generer')
  @Roles(UserRole.MAITRE, UserRole.DIRECTEUR, UserRole.ADMIN)
  generer(@Body() dto: GenererBulletinsDto) {
    return this.service.genererBulletins(dto.classeId, dto.anneeScolaireId, dto.periode);
  }

  @Get('classe/:classeId')
  @Roles(UserRole.MAITRE, UserRole.DIRECTEUR, UserRole.ADMIN)
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
  @Roles(UserRole.DIRECTEUR, UserRole.ADMIN)
  publier(@Param('id', ParseIntPipe) id: number) {
    return this.service.publier(id);
  }
}
