import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ExamensService } from './examens.service';
import { CreateExamenDto } from './dto/create-examen.dto';
import { UpdateExamenDto } from './dto/update-examen.dto';

@Controller('examens')
export class ExamensController {
  constructor(private readonly service: ExamensService) {}

  @Post()
  create(@Body() dto: CreateExamenDto) { return this.service.create(dto); }

  @Get()
  findAll(@Query('classeId') classeId?: string, @Query('anneeScolaireId') anneeScolaireId?: string) {
    return this.service.findAll(
      classeId ? parseInt(classeId) : undefined,
      anneeScolaireId ? parseInt(anneeScolaireId) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateExamenDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
