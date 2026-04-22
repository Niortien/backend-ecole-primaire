import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Caisse } from './caisse.entity';
import { PaiementsService } from '../paiements/paiements.service';
import { DepensesService } from '../depenses/depenses.service';

@Injectable()
export class CaisseService {
  constructor(
    @InjectRepository(Caisse)
    private readonly repo: Repository<Caisse>,
    private readonly paiementsService: PaiementsService,
    private readonly depensesService: DepensesService,
  ) {}

  async cloturerJournee(date: string, comptableId: number): Promise<Caisse> {
    const existingEntry = await this.repo.findOne({ where: { date: date as any } });

    // Récupérer le solde de la veille
    const veille = new Date(date);
    veille.setDate(veille.getDate() - 1);
    const veilleStr = veille.toISOString().split('T')[0];
    const caisseVeille = await this.repo.findOne({ where: { date: veilleStr as any } });

    const soldeOuverture = caisseVeille ? Number(caisseVeille.soldeFermeture) : 0;
    const totalEntrees = await this.paiementsService.totalEncaisseParJour(date);
    const totalSorties = await this.depensesService.totalDepensesParJour(date);
    const soldeFermeture = soldeOuverture + totalEntrees - totalSorties;

    const caisse = existingEntry ?? this.repo.create({ date: date as any });
    caisse.soldeOuverture = soldeOuverture;
    caisse.totalEntrees = totalEntrees;
    caisse.totalSorties = totalSorties;
    caisse.soldeFermeture = soldeFermeture;
    caisse.comptable = { id: comptableId } as any;

    return this.repo.save(caisse);
  }

  findAll(dateDebut?: string, dateFin?: string): Promise<Caisse[]> {
    const query = this.repo.createQueryBuilder('c');
    if (dateDebut) query.andWhere('c.date >= :dateDebut', { dateDebut });
    if (dateFin) query.andWhere('c.date <= :dateFin', { dateFin });
    return query.orderBy('c.date', 'DESC').getMany();
  }

  async soldeActuel(): Promise<number> {
    const last = await this.repo.findOne({ order: { date: 'DESC' }, where: {} });
    return last ? Number(last.soldeFermeture) : 0;
  }
}
