import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Maitre } from './maitre.entity';
import { Classe } from '../classes/classe.entity';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/user.entity';
import { CreateMaitreDto } from './dto/create-maitre.dto';
import { UpdateMaitreDto } from './dto/update-maitre.dto';

@Injectable()
export class MaitresService {
  constructor(
    @InjectRepository(Maitre)
    private readonly repo: Repository<Maitre>,
    @InjectRepository(Classe)
    private readonly classeRepo: Repository<Classe>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateMaitreDto): Promise<Maitre> {
    const user = await this.usersService.create({
      email: dto.email,
      password: dto.password,
      role: UserRole.MAITRE,
    });
    const maitre = this.repo.create({
      nom: dto.nom,
      prenom: dto.prenom,
      telephone: dto.telephone,
      diplome: dto.diplome,
      specialite: dto.specialite,
      dateEmbauche: dto.dateEmbauche as any,
      user,
    });
    return this.repo.save(maitre);
  }

  findAll(): Promise<Maitre[]> {
    return this.repo.find({ relations: ['user', 'classes'], order: { nom: 'ASC' } });
  }

  async findOne(id: number): Promise<Maitre> {
    const maitre = await this.repo.findOne({ where: { id }, relations: ['user', 'classes'] });
    if (!maitre) throw new NotFoundException(`Maître #${id} introuvable`);
    return maitre;
  }

  async findByUserId(userId: number): Promise<Maitre | null> {
    return this.repo.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'classes'],
    });
  }

  async update(id: number, dto: UpdateMaitreDto): Promise<Maitre> {
    const maitre = await this.findOne(id);
    const { email, password, ...rest } = dto;
    Object.assign(maitre, rest);
    return this.repo.save(maitre);
  }

  async affecterClasses(id: number, classeIds: number[]): Promise<Maitre> {
    const maitre = await this.findOne(id);
    const classes = await this.classeRepo.findBy({ id: In(classeIds) });
    maitre.classes = classes;
    return this.repo.save(maitre);
  }

  async remove(id: number): Promise<void> {
    const maitre = await this.findOne(id);
    await this.repo.remove(maitre);
  }
}
