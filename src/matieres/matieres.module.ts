import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Matiere } from './matiere.entity';
import { MatieresService } from './matieres.service';
import { MatieresController } from './matieres.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Matiere])],
  providers: [MatieresService],
  controllers: [MatieresController],
  exports: [MatieresService],
})
export class MatieresModule {}
