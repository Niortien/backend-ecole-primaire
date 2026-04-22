import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { MaitresService } from './maitres.service';
import { CreateMaitreDto } from './dto/create-maitre.dto';
import { UpdateMaitreDto } from './dto/update-maitre.dto';
import { AffectClassesDto } from './dto/affect-classes.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('maitres')
export class MaitresController {
  constructor(private readonly service: MaitresService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DIRECTEUR)
  create(@Body() dto: CreateMaitreDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DIRECTEUR)
  findAll() {
    return this.service.findAll();
  }

  @Get('mon-profil')
  @Roles(UserRole.MAITRE)
  getMyProfile(@Request() req: any) {
    return this.service.findByUserId(req.user.id);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTEUR)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTEUR)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMaitreDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/classes')
  @Roles(UserRole.ADMIN, UserRole.DIRECTEUR)
  affecterClasses(@Param('id', ParseIntPipe) id: number, @Body() dto: AffectClassesDto) {
    return this.service.affecterClasses(id, dto.classeIds);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
