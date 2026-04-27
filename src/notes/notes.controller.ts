import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Periode } from './note.entity';

@Controller('notes')
export class NotesController {
  constructor(private readonly service: NotesService) {}

  @Post()
  create(@Body() dto: CreateNoteDto, @Request() req: any) {
    return this.service.create(dto, req.user?.maitreId);
  }

  @Get('classe/:classeId')
  findByClasse(
    @Param('classeId', ParseIntPipe) classeId: number,
    @Query('periode') periode: Periode,
    @Query('anneeScolaireId', ParseIntPipe) anneeScolaireId: number,
  ) {
    return this.service.findByClasse(classeId, periode, anneeScolaireId);
  }

  @Get('eleve/:eleveId')
  findByEleve(
    @Param('eleveId', ParseIntPipe) eleveId: number,
    @Query('anneeScolaireId', ParseIntPipe) anneeScolaireId: number,
  ) {
    return this.service.findByEleve(eleveId, anneeScolaireId);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNoteDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
