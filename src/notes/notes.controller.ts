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
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Periode } from './note.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly service: NotesService) {}

  @Post()
  @Roles(UserRole.MAITRE, UserRole.DIRECTEUR, UserRole.ADMIN)
  create(@Body() dto: CreateNoteDto, @Request() req: any) {
    return this.service.create(dto, req.user?.maitreId);
  }

  @Get('classe/:classeId')
  @Roles(UserRole.MAITRE, UserRole.DIRECTEUR, UserRole.ADMIN)
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
  @Roles(UserRole.MAITRE, UserRole.DIRECTEUR, UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNoteDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.MAITRE, UserRole.DIRECTEUR, UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
