import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classe } from './classe.entity';
import { CreateClasseDto } from './dto/create-classe.dto';
import { UpdateClasseDto } from './dto/update-classe.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Classe)
    private readonly repo: Repository<Classe>,
  ) {}

  async create(dto: CreateClasseDto): Promise<Classe> {
    const classe = this.repo.create({
      nom: dto.nom,
      libelle: dto.libelle,
      niveau: dto.niveau,
      capacite: dto.capacite ?? 30,
      anneeScolaire: { id: dto.anneeScolaireId } as any,
    });
    return this.repo.save(classe);
  }

  findAll(anneeScolaireId?: number): Promise<Classe[]> {
    const query = this.repo.createQueryBuilder('classe')
      .leftJoinAndSelect('classe.anneeScolaire', 'annee');
    if (anneeScolaireId) {
      query.where('annee.id = :anneeScolaireId', { anneeScolaireId });
    }
    return query.orderBy('classe.nom', 'ASC').getMany();
  }

  async findOne(id: number): Promise<Classe> {
    const classe = await this.repo.findOne({
      where: { id },
      relations: ['anneeScolaire'],
    });
    if (!classe) throw new NotFoundException(`Classe #${id} introuvable`);
    return classe;
  }

  async update(id: number, dto: UpdateClasseDto): Promise<Classe> {
    const classe = await this.findOne(id);
    Object.assign(classe, dto);
    if (dto.anneeScolaireId) {
      classe.anneeScolaire = { id: dto.anneeScolaireId } as any;
    }
    return this.repo.save(classe);
  }

  async remove(id: number): Promise<void> {
    const classe = await this.findOne(id);
    await this.repo.remove(classe);
  }
}
