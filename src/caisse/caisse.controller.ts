import { Controller, Get, Post, Body, Query, Request } from '@nestjs/common';
import { CaisseService } from './caisse.service';
import { IsDateString } from 'class-validator';

class CloturerJourneeDto {
  @IsDateString()
  date!: string;
}

@Controller('caisse')
export class CaisseController {
  constructor(private readonly service: CaisseService) {}

  @Post('cloturer')
  cloturer(@Body() dto: CloturerJourneeDto, @Request() req: any) {
    return this.service.cloturerJournee(dto.date, req.user.id);
  }

  @Get()
  findAll(@Query('dateDebut') dateDebut?: string, @Query('dateFin') dateFin?: string) {
    return this.service.findAll(dateDebut, dateFin);
  }

  @Get('solde')
  soldeActuel() {
    return this.service.soldeActuel();
  }
}
