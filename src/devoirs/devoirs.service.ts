import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Devoir } from './devoir.entity';
import { CreateDevoirDto } from './dto/create-devoir.dto';
import { UpdateDevoirDto } from './dto/update-devoir.dto';

@Injectable()
export class DevoirsService {
  constructor(
    @InjectRepository(Devoir)
    private readonly repo: Repository<Devoir>,
  ) {}

  async create(dto: CreateDevoirDto, maitreId?: number): Promise<Devoir> {
    const devoir = this.repo.create({
      titre: dto.titre,
      description: dto.description,
      dateDonnee: dto.dateDonnee as any,
      dateRendu: dto.dateRendu as any,
      matiere: { id: dto.matiereId } as any,
      classe: { id: dto.classeId } as any,
      maitre: maitreId ? ({ id: maitreId } as any) : undefined,
    });
    return this.repo.save(devoir);
  }

  findByClasse(classeId: number): Promise<Devoir[]> {
    return this.repo.find({
      where: { classe: { id: classeId } },
      relations: ['matiere'],
      order: { dateDonnee: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Devoir> {
    const devoir = await this.repo.findOne({ where: { id }, relations: ['matiere', 'classe', 'maitre'] });
    if (!devoir) throw new NotFoundException(`Devoir #${id} introuvable`);
    return devoir;
  }

  async update(id: number, dto: UpdateDevoirDto): Promise<Devoir> {
    const devoir = await this.findOne(id);
    Object.assign(devoir, dto);
    return this.repo.save(devoir);
  }

  async remove(id: number): Promise<void> {
    const devoir = await this.findOne(id);
    await this.repo.remove(devoir);
  }
}
