import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Eleve } from '../eleves/eleve.entity';
import { Paiement } from '../paiements/paiement.entity';
import { Depense } from '../depenses/depense.entity';
import { Presence } from '../presences/presence.entity';
import { Classe } from '../classes/classe.entity';
import { RapportsService } from './rapports.service';
import { RapportsController } from './rapports.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Eleve, Paiement, Depense, Presence, Classe])],
  providers: [RapportsService],
  controllers: [RapportsController],
})
export class RapportsModule {}
