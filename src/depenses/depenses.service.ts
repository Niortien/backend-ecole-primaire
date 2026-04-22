import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Depense } from './depense.entity';
import { CreateDepenseDto } from './dto/create-depense.dto';

@Injectable()
export class DepensesService {
  constructor(
    @InjectRepository(Depense)
    private readonly repo: Repository<Depense>,
  ) {}

  async create(dto: CreateDepenseDto, comptableId: number): Promise<Depense> {
    const depense = this.repo.create({
      ...dto,
      date: dto.date as any,
      comptable: { id: comptableId } as any,
    });
    return this.repo.save(depense);
  }

  findAll(dateDebut?: string, dateFin?: string): Promise<Depense[]> {
    const query = this.repo.createQueryBuilder('d');
    if (dateDebut) query.andWhere('d.date >= :dateDebut', { dateDebut });
    if (dateFin) query.andWhere('d.date <= :dateFin', { dateFin });
    return query.orderBy('d.date', 'DESC').getMany();
  }

  async findOne(id: number): Promise<Depense> {
    const depense = await this.repo.findOne({ where: { id } });
    if (!depense) throw new NotFoundException(`Dépense #${id} introuvable`);
    return depense;
  }

  async remove(id: number): Promise<void> {
    const depense = await this.findOne(id);
    await this.repo.remove(depense);
  }

  async totalDepensesParJour(date: string): Promise<number> {
    const result = await this.repo.createQueryBuilder('d')
      .select('SUM(d.montant)', 'total')
      .where('d.date = :date', { date })
      .getRawOne();
    return Number(result?.total ?? 0);
  }
}
