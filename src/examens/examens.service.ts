import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Examen } from './examen.entity';
import { CreateExamenDto } from './dto/create-examen.dto';
import { UpdateExamenDto } from './dto/update-examen.dto';

@Injectable()
export class ExamensService {
  constructor(
    @InjectRepository(Examen)
    private readonly repo: Repository<Examen>,
  ) {}

  async create(dto: CreateExamenDto): Promise<Examen> {
    const examen = this.repo.create({
      libelle: dto.libelle,
      type: dto.type,
      date: dto.date as any,
      dureeMinutes: dto.dureeMinutes,
      classe: { id: dto.classeId } as any,
      matiere: dto.matiereId ? ({ id: dto.matiereId } as any) : undefined,
      anneeScolaire: { id: dto.anneeScolaireId } as any,
    });
    return this.repo.save(examen);
  }

  findAll(classeId?: number, anneeScolaireId?: number): Promise<Examen[]> {
    const where: any = {};
    if (classeId) where.classe = { id: classeId };
    if (anneeScolaireId) where.anneeScolaire = { id: anneeScolaireId };
    return this.repo.find({ where, order: { date: 'ASC' } });
  }

  async findOne(id: number): Promise<Examen> {
    const examen = await this.repo.findOne({ where: { id } });
    if (!examen) throw new NotFoundException(`Examen #${id} introuvable`);
    return examen;
  }

  async update(id: number, dto: UpdateExamenDto): Promise<Examen> {
    const examen = await this.findOne(id);
    Object.assign(examen, dto);
    return this.repo.save(examen);
  }

  async remove(id: number): Promise<void> {
    const examen = await this.findOne(id);
    await this.repo.remove(examen);
  }
}
