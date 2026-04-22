import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { ExamensService } from './examens.service';
import { CreateExamenDto } from './dto/create-examen.dto';
import { UpdateExamenDto } from './dto/update-examen.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('examens')
export class ExamensController {
  constructor(private readonly service: ExamensService) {}

  @Post()
  @Roles(UserRole.MAITRE, UserRole.DIRECTEUR, UserRole.ADMIN)
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
  @Roles(UserRole.MAITRE, UserRole.DIRECTEUR, UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateExamenDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTEUR)
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
