import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class MessagerieService {
  constructor(
    @InjectRepository(Message)
    private readonly repo: Repository<Message>,
  ) {}

  async envoyer(dto: SendMessageDto, expediteurId: number): Promise<Message> {
    const message = this.repo.create({
      expediteur: { id: expediteurId } as any,
      destinataire: { id: dto.destinataireId } as any,
      sujet: dto.sujet,
      contenu: dto.contenu,
      conversationId: dto.conversationId ?? randomUUID(),
    });
    return this.repo.save(message);
  }

  getBoiteReception(userId: number): Promise<Message[]> {
    return this.repo.find({
      where: { destinataire: { id: userId } },
      order: { dateEnvoi: 'DESC' },
    });
  }

  getBoiteEnvoi(userId: number): Promise<Message[]> {
    return this.repo.find({
      where: { expediteur: { id: userId } },
      order: { dateEnvoi: 'DESC' },
    });
  }

  getConversation(conversationId: string): Promise<Message[]> {
    return this.repo.find({
      where: { conversationId },
      order: { dateEnvoi: 'ASC' },
    });
  }

  async marquerLu(id: number, userId: number): Promise<Message> {
    const message = await this.repo.findOneOrFail({ where: { id, destinataire: { id: userId } } });
    message.lu = true;
    return this.repo.save(message);
  }

  async countNonLus(userId: number): Promise<number> {
    return this.repo.count({ where: { destinataire: { id: userId }, lu: false } });
  }
}
