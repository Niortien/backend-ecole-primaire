import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Devoir } from './devoir.entity';
import { DevoirsService } from './devoirs.service';
import { DevoirsController } from './devoirs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Devoir])],
  providers: [DevoirsService],
  controllers: [DevoirsController],
  exports: [DevoirsService],
})
export class DevoirsModule {}
