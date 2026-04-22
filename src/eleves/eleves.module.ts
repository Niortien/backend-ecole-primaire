import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Eleve } from './eleve.entity';
import { ElevesService } from './eleves.service';
import { ElevesController } from './eleves.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Eleve])],
  providers: [ElevesService],
  controllers: [ElevesController],
  exports: [ElevesService],
})
export class ElevesModule {}
