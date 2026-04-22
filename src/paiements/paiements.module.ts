import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paiement } from './paiement.entity';
import { PaiementsService } from './paiements.service';
import { PaiementsController } from './paiements.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Paiement])],
  providers: [PaiementsService],
  controllers: [PaiementsController],
  exports: [PaiementsService],
})
export class PaiementsModule {}
