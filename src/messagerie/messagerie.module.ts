import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { MessagerieService } from './messagerie.service';
import { MessagerieController } from './messagerie.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  providers: [MessagerieService],
  controllers: [MessagerieController],
  exports: [MessagerieService],
})
export class MessagerieModule {}
