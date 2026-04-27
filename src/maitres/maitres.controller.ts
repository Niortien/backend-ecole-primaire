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
  Request,
} from '@nestjs/common';
import { MaitresService } from './maitres.service';
import { CreateMaitreDto } from './dto/create-maitre.dto';
import { UpdateMaitreDto } from './dto/update-maitre.dto';
import { AffectClassesDto } from './dto/affect-classes.dto';

@Controller('maitres')
export class MaitresController {
  constructor(private readonly service: MaitresService) {}

  @Post()
  create(@Body() dto: CreateMaitreDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('mon-profil')
  getMyProfile(@Request() req: any) {
    return this.service.findByUserId(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMaitreDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/classes')
  affecterClasses(@Param('id', ParseIntPipe) id: number, @Body() dto: AffectClassesDto) {
    return this.service.affecterClasses(id, dto.classeIds);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
