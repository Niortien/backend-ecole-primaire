import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Eleve, StatutEleve } from './eleve.entity';
import { CreateEleveDto } from './dto/create-eleve.dto';
import { UpdateEleveDto } from './dto/update-eleve.dto';

@Injectable()
export class ElevesService {
  constructor(
    @InjectRepository(Eleve)
    private readonly repo: Repository<Eleve>,
  ) {}

  async create(dto: CreateEleveDto): Promise<Eleve> {
    const eleve = this.repo.create({
      ...dto,
      classe: dto.classeId ? ({ id: dto.classeId } as any) : undefined,
      parent: dto.parentId ? ({ id: dto.parentId } as any) : undefined,
    });
    return this.repo.save(eleve);
  }

  findAll(classeId?: number, parentId?: number): Promise<Eleve[]> {
    const query = this.repo.createQueryBuilder('eleve')
      .leftJoinAndSelect('eleve.classe', 'classe')
      .leftJoinAndSelect('eleve.parent', 'parent');

    if (classeId) query.andWhere('classe.id = :classeId', { classeId });
    if (parentId) query.andWhere('parent.id = :parentId', { parentId });

    return query.orderBy('eleve.nom', 'ASC').addOrderBy('eleve.prenom', 'ASC').getMany();
  }

  async findOne(id: number): Promise<Eleve> {
    const eleve = await this.repo.findOne({
      where: { id },
      relations: ['classe', 'parent'],
    });
    if (!eleve) throw new NotFoundException(`Élève #${id} introuvable`);
    return eleve;
  }

  async update(id: number, dto: UpdateEleveDto): Promise<Eleve> {
    const eleve = await this.findOne(id);
    const { classeId, parentId, ...rest } = dto;
    Object.assign(eleve, rest);
    if (classeId !== undefined) eleve.classe = { id: classeId } as any;
    if (parentId !== undefined) eleve.parent = { id: parentId } as any;
    return this.repo.save(eleve);
  }

  async changerStatut(id: number, statut: StatutEleve): Promise<Eleve> {
    const eleve = await this.findOne(id);
    eleve.statut = statut;
    return this.repo.save(eleve);
  }

  async remove(id: number): Promise<void> {
    const eleve = await this.findOne(id);
    await this.repo.remove(eleve);
  }
}
