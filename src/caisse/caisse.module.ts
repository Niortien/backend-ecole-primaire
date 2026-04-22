import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Caisse } from './caisse.entity';
import { CaisseService } from './caisse.service';
import { CaisseController } from './caisse.controller';
import { PaiementsModule } from '../paiements/paiements.module';
import { DepensesModule } from '../depenses/depenses.module';

@Module({
  imports: [TypeOrmModule.forFeature([Caisse]), PaiementsModule, DepensesModule],
  providers: [CaisseService],
  controllers: [CaisseController],
  exports: [CaisseService],
})
export class CaisseModule {}
