import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FraisScolarite } from './frais-scolarite.entity';
import { CreateFraisScolariteDto } from './dto/create-frais-scolarite.dto';
import { UpdateFraisScolariteDto } from './dto/update-frais-scolarite.dto';

@Injectable()
export class FraisScolariteService {
  constructor(
    @InjectRepository(FraisScolarite)
    private readonly repo: Repository<FraisScolarite>,
  ) {}

  async create(dto: CreateFraisScolariteDto): Promise<FraisScolarite> {
    const frais = this.repo.create({
      ...dto,
      classe: dto.classeId ? ({ id: dto.classeId } as any) : undefined,
      anneeScolaire: { id: dto.anneeScolaireId } as any,
    });
    return this.repo.save(frais);
  }

  findAll(anneeScolaireId?: number): Promise<FraisScolarite[]> {
    const where: any = {};
    if (anneeScolaireId) where.anneeScolaire = { id: anneeScolaireId };
    return this.repo.find({ where, order: { libelle: 'ASC' } });
  }

  async findOne(id: number): Promise<FraisScolarite> {
    const frais = await this.repo.findOne({ where: { id } });
    if (!frais) throw new NotFoundException(`Frais #${id} introuvable`);
    return frais;
  }

  async update(id: number, dto: UpdateFraisScolariteDto): Promise<FraisScolarite> {
    const frais = await this.findOne(id);
    Object.assign(frais, dto);
    if (dto.classeId !== undefined) frais.classe = { id: dto.classeId } as any;
    return this.repo.save(frais);
  }

  async remove(id: number): Promise<void> {
    const frais = await this.findOne(id);
    await this.repo.remove(frais);
  }
}
