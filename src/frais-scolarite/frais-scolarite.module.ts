import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FraisScolarite } from './frais-scolarite.entity';
import { FraisScolariteService } from './frais-scolarite.service';
import { FraisScolariteController } from './frais-scolarite.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FraisScolarite])],
  providers: [FraisScolariteService],
  controllers: [FraisScolariteController],
  exports: [FraisScolariteService],
})
export class FraisScolariteModule {}
