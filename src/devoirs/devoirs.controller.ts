import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { DevoirsService } from './devoirs.service';
import { CreateDevoirDto } from './dto/create-devoir.dto';
import { UpdateDevoirDto } from './dto/update-devoir.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('devoirs')
export class DevoirsController {
  constructor(private readonly service: DevoirsService) {}

  @Post()
  @Roles(UserRole.MAITRE, UserRole.DIRECTEUR, UserRole.ADMIN)
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
  @Roles(UserRole.MAITRE, UserRole.DIRECTEUR, UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDevoirDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.MAITRE, UserRole.DIRECTEUR, UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
