import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, Request } from '@nestjs/common';
import { DevoirsService } from './devoirs.service';
import { CreateDevoirDto } from './dto/create-devoir.dto';
import { UpdateDevoirDto } from './dto/update-devoir.dto';

@Controller('devoirs')
export class DevoirsController {
  constructor(private readonly service: DevoirsService) {}

  @Post()
  create(@Body() dto: CreateDevoirDto, @Request() req: any) {
    return this.service.create(dto, req.user?.maitreId);
  }

  @Get('classe/:classeId')
  findByClasse(@Param('classeId', ParseIntPipe) classeId: number) {
    return this.service.findByClasse(classeId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDevoirDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
