import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Matiere } from './matiere.entity';
import { CreateMatiereDto } from './dto/create-matiere.dto';
import { UpdateMatiereDto } from './dto/update-matiere.dto';

@Injectable()
export class MatieresService {
  constructor(
    @InjectRepository(Matiere)
    private readonly repo: Repository<Matiere>,
  ) {}

  async create(dto: CreateMatiereDto): Promise<Matiere> {
    const existing = await this.repo.findOne({ where: { code: dto.code } });
    if (existing) throw new ConflictException(`La matière avec le code "${dto.code}" existe déjà`);
    const matiere = this.repo.create(dto);
    return this.repo.save(matiere);
  }

  findAll(): Promise<Matiere[]> {
    return this.repo.find({ order: { nom: 'ASC' } });
  }

  async findOne(id: number): Promise<Matiere> {
    const matiere = await this.repo.findOne({ where: { id } });
    if (!matiere) throw new NotFoundException(`Matière #${id} introuvable`);
    return matiere;
  }

  async update(id: number, dto: UpdateMatiereDto): Promise<Matiere> {
    const matiere = await this.findOne(id);
    Object.assign(matiere, dto);
    return this.repo.save(matiere);
  }

  async remove(id: number): Promise<void> {
    const matiere = await this.findOne(id);
    await this.repo.remove(matiere);
  }
}
