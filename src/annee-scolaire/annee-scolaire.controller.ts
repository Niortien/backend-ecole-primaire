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
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { AnneeScolaireService } from './annee-scolaire.service';
import { CreateAnneeScolaireDto } from './dto/create-annee-scolaire.dto';
import { UpdateAnneeScolaireDto } from './dto/update-annee-scolaire.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('annees-scolaires')
export class AnneeScolaireController {
  constructor(private readonly service: AnneeScolaireService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DIRECTEUR)
  create(@Body() dto: CreateAnneeScolaireDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('active')
  findActive() {
    return this.service.findActive();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTEUR)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAnneeScolaireDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/activate')
  @Roles(UserRole.ADMIN, UserRole.DIRECTEUR)
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.service.activate(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
