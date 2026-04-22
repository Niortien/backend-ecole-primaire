import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnneeScolaire } from './annee-scolaire.entity';
import { CreateAnneeScolaireDto } from './dto/create-annee-scolaire.dto';
import { UpdateAnneeScolaireDto } from './dto/update-annee-scolaire.dto';

@Injectable()
export class AnneeScolaireService {
  constructor(
    @InjectRepository(AnneeScolaire)
    private readonly repo: Repository<AnneeScolaire>,
  ) {}

  async create(dto: CreateAnneeScolaireDto): Promise<AnneeScolaire> {
    const existing = await this.repo.findOne({ where: { libelle: dto.libelle } });
    if (existing) throw new ConflictException('Cette année scolaire existe déjà');
    const annee = this.repo.create(dto);
    return this.repo.save(annee);
  }

  findAll(): Promise<AnneeScolaire[]> {
    return this.repo.find({ order: { libelle: 'DESC' } });
  }

  async findOne(id: number): Promise<AnneeScolaire> {
    const annee = await this.repo.findOne({ where: { id } });
    if (!annee) throw new NotFoundException(`Année scolaire #${id} introuvable`);
    return annee;
  }

  async findActive(): Promise<AnneeScolaire | null> {
    return this.repo.findOne({ where: { estActive: true } });
  }

  async update(id: number, dto: UpdateAnneeScolaireDto): Promise<AnneeScolaire> {
    const annee = await this.findOne(id);
    Object.assign(annee, dto);
    return this.repo.save(annee);
  }

  async activate(id: number): Promise<AnneeScolaire> {
    // Désactiver toutes les autres années
    await this.repo.update({}, { estActive: false });
    const annee = await this.findOne(id);
    annee.estActive = true;
    return this.repo.save(annee);
  }

  async remove(id: number): Promise<void> {
    const annee = await this.findOne(id);
    await this.repo.remove(annee);
  }
}
