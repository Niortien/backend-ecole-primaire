import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bulletin } from './bulletin.entity';
import { Note } from '../notes/note.entity';
import { BulletinsService } from './bulletins.service';
import { BulletinsController } from './bulletins.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bulletin, Note])],
  providers: [BulletinsService],
  controllers: [BulletinsController],
  exports: [BulletinsService],
})
export class BulletinsModule {}
