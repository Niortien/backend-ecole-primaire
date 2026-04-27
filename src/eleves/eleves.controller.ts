import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ElevesService } from './eleves.service';
import { CreateEleveDto } from './dto/create-eleve.dto';
import { UpdateEleveDto } from './dto/update-eleve.dto';
import { StatutEleve } from './eleve.entity';
import { IsEnum } from 'class-validator';

class ChangerStatutDto {
  @IsEnum(StatutEleve)
  statut!: StatutEleve;
}

@Controller('eleves')
export class ElevesController {
  constructor(private readonly service: ElevesService) {}

  @Post()
  create(@Body() dto: CreateEleveDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query('classeId') classeId?: string,
    @Query('parentId') parentId?: string,
  ) {
    return this.service.findAll(
      classeId ? parseInt(classeId) : undefined,
      parentId ? parseInt(parentId) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEleveDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/statut')
  changerStatut(@Param('id', ParseIntPipe) id: number, @Body() dto: ChangerStatutDto) {
    return this.service.changerStatut(id, dto.statut);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
