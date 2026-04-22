import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { CaisseService } from './caisse.service';
import { IsDateString } from 'class-validator';

class CloturerJourneeDto {
  @IsDateString()
  date!: string;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('caisse')
export class CaisseController {
  constructor(private readonly service: CaisseService) {}

  @Post('cloturer')
  @Roles(UserRole.COMPTABLE, UserRole.ADMIN)
  cloturer(@Body() dto: CloturerJourneeDto, @Request() req: any) {
    return this.service.cloturerJournee(dto.date, req.user.id);
  }

  @Get()
  @Roles(UserRole.COMPTABLE, UserRole.ADMIN, UserRole.DIRECTEUR)
  findAll(@Query('dateDebut') dateDebut?: string, @Query('dateFin') dateFin?: string) {
    return this.service.findAll(dateDebut, dateFin);
  }

  @Get('solde')
  @Roles(UserRole.COMPTABLE, UserRole.ADMIN, UserRole.DIRECTEUR)
  soldeActuel() {
    return this.service.soldeActuel();
  }
}
