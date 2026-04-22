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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { ElevesService } from './eleves.service';
import { CreateEleveDto } from './dto/create-eleve.dto';
import { UpdateEleveDto } from './dto/update-eleve.dto';
import { StatutEleve } from './eleve.entity';
import { IsEnum } from 'class-validator';

class ChangerStatutDto {
  @IsEnum(StatutEleve)
  statut!: StatutEleve;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('eleves')
export class ElevesController {
  constructor(private readonly service: ElevesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DIRECTEUR)
  create(@Body() dto: CreateEleveDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DIRECTEUR, UserRole.MAITRE, UserRole.COMPTABLE)
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
  @Roles(UserRole.ADMIN, UserRole.DIRECTEUR)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEleveDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/statut')
  @Roles(UserRole.ADMIN, UserRole.DIRECTEUR)
  changerStatut(@Param('id', ParseIntPipe) id: number, @Body() dto: ChangerStatutDto) {
    return this.service.changerStatut(id, dto.statut);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
