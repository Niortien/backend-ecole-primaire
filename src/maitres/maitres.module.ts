import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Maitre } from './maitre.entity';
import { Classe } from '../classes/classe.entity';
import { MaitresService } from './maitres.service';
import { MaitresController } from './maitres.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Maitre, Classe]), UsersModule],
  providers: [MaitresService],
  controllers: [MaitresController],
  exports: [MaitresService],
})
export class MaitresModule {}
