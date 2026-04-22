import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnneeScolaire } from './annee-scolaire.entity';
import { AnneeScolaireService } from './annee-scolaire.service';
import { AnneeScolaireController } from './annee-scolaire.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AnneeScolaire])],
  providers: [AnneeScolaireService],
  controllers: [AnneeScolaireController],
  exports: [AnneeScolaireService],
})
export class AnneeScolaireModule {}
