import { Controller, Get, Post, Delete, Body, Param, Query, ParseIntPipe, Request } from '@nestjs/common';
import { DepensesService } from './depenses.service';
import { CreateDepenseDto } from './dto/create-depense.dto';

@Controller('depenses')
export class DepensesController {
  constructor(private readonly service: DepensesService) {}

  @Post()
  create(@Body() dto: CreateDepenseDto, @Request() req: any) {
    return this.service.create(dto, req.user.id);
  }

  @Get()
  findAll(@Query('dateDebut') dateDebut?: string, @Query('dateFin') dateFin?: string) {
    return this.service.findAll(dateDebut, dateFin);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
