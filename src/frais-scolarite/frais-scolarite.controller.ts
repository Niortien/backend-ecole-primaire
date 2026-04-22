import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { FraisScolariteService } from './frais-scolarite.service';
import { CreateFraisScolariteDto } from './dto/create-frais-scolarite.dto';
import { UpdateFraisScolariteDto } from './dto/update-frais-scolarite.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('frais-scolarite')
export class FraisScolariteController {
  constructor(private readonly service: FraisScolariteService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DIRECTEUR, UserRole.COMPTABLE)
  create(@Body() dto: CreateFraisScolariteDto) { return this.service.create(dto); }

  @Get()
  findAll(@Query('anneeScolaireId') anneeScolaireId?: string) {
    return this.service.findAll(anneeScolaireId ? parseInt(anneeScolaireId) : undefined);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTEUR, UserRole.COMPTABLE)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFraisScolariteDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTEUR)
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
