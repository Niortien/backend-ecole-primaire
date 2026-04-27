import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { FraisScolariteService } from './frais-scolarite.service';
import { CreateFraisScolariteDto } from './dto/create-frais-scolarite.dto';
import { UpdateFraisScolariteDto } from './dto/update-frais-scolarite.dto';

@Controller('frais-scolarite')
export class FraisScolariteController {
  constructor(private readonly service: FraisScolariteService) {}

  @Post()
  create(@Body() dto: CreateFraisScolariteDto) { return this.service.create(dto); }

  @Get()
  findAll(@Query('anneeScolaireId') anneeScolaireId?: string) {
    return this.service.findAll(anneeScolaireId ? parseInt(anneeScolaireId) : undefined);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFraisScolariteDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
