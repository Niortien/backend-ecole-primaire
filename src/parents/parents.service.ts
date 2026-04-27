import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parent } from './parent.entity';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/user.entity';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';

@Injectable()
export class ParentsService {
  constructor(
    @InjectRepository(Parent)
    private readonly repo: Repository<Parent>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateParentDto): Promise<Parent> {
    const user = await this.usersService.create({
      email: dto.email,
      password: dto.password,
      role: UserRole.PARENT,
    });
    const parent = this.repo.create({
      nom: dto.nom,
      prenom: dto.prenom,
      telephone: dto.telephone,
      telephoneUrgence: dto.telephoneUrgence,
      profession: dto.profession,
      adresse: dto.adresse,
      user,
    });
    return this.repo.save(parent);
  }

  findAll(): Promise<Parent[]> {
    return this.repo.find({ relations: ['user', 'eleves', 'eleves.classe'], order: { nom: 'ASC' } });
  }

  async findOne(id: number): Promise<Parent> {
    const parent = await this.repo.findOne({ where: { id }, relations: ['user', 'eleves', 'eleves.classe'] });
    if (!parent) throw new NotFoundException(`Parent #${id} introuvable`);
    return parent;
  }

  async findByUserId(userId: number): Promise<Parent | null> {
    return this.repo.findOne({ where: { user: { id: userId } }, relations: ['user', 'eleves', 'eleves.classe'] });
  }

  async update(id: number, dto: UpdateParentDto): Promise<Parent> {
    const parent = await this.findOne(id);
    const { email, password, ...rest } = dto;
    Object.assign(parent, rest);
    return this.repo.save(parent);
  }

  async remove(id: number): Promise<void> {
    const parent = await this.findOne(id);
    await this.repo.remove(parent);
  }
}
