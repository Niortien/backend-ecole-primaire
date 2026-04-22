import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paiement, StatutPaiement } from './paiement.entity';
import { CreatePaiementDto } from './dto/create-paiement.dto';

@Injectable()
export class PaiementsService {
  constructor(
    @InjectRepository(Paiement)
    private readonly repo: Repository<Paiement>,
  ) {}

  async create(dto: CreatePaiementDto, comptableId: number): Promise<Paiement> {
    const paiement = this.repo.create({
      eleve: { id: dto.eleveId } as any,
      fraisScolarite: { id: dto.fraisScolariteId } as any,
      montant: dto.montant,
      datePaiement: dto.datePaiement as any,
      modePaiement: dto.modePaiement,
      referencePaiement: dto.referencePaiement,
      commentaire: dto.commentaire,
      comptable: { id: comptableId } as any,
    });
    return this.repo.save(paiement);
  }

  findByEleve(eleveId: number): Promise<Paiement[]> {
    return this.repo.find({
      where: { eleve: { id: eleveId }, statut: StatutPaiement.VALIDE },
      relations: ['fraisScolarite'],
      order: { datePaiement: 'DESC' },
    });
  }

  findAll(dateDebut?: string, dateFin?: string): Promise<Paiement[]> {
    const query = this.repo.createQueryBuilder('p')
      .leftJoinAndSelect('p.eleve', 'eleve')
      .leftJoinAndSelect('p.fraisScolarite', 'frais')
      .where('p.statut = :statut', { statut: StatutPaiement.VALIDE });

    if (dateDebut) query.andWhere('p.datePaiement >= :dateDebut', { dateDebut });
    if (dateFin) query.andWhere('p.datePaiement <= :dateFin', { dateFin });

    return query.orderBy('p.datePaiement', 'DESC').getMany();
  }

  async annuler(id: number): Promise<Paiement> {
    const paiement = await this.repo.findOneOrFail({ where: { id } });
    paiement.statut = StatutPaiement.ANNULE;
    return this.repo.save(paiement);
  }

  async totalEncaisseParJour(date: string): Promise<number> {
    const result = await this.repo.createQueryBuilder('p')
      .select('SUM(p.montant)', 'total')
      .where('p.datePaiement = :date', { date })
      .andWhere('p.statut = :statut', { statut: StatutPaiement.VALIDE })
      .getRawOne();
    return Number(result?.total ?? 0);
  }

  async situationEleve(eleveId: number, anneeScolaireId: number) {
    const paiements = await this.repo.find({
      where: {
        eleve: { id: eleveId },
        fraisScolarite: { anneeScolaire: { id: anneeScolaireId } },
        statut: StatutPaiement.VALIDE,
      },
      relations: ['fraisScolarite'],
    });
    const totalPaye = paiements.reduce((sum, p) => sum + Number(p.montant), 0);
    return { paiements, totalPaye };
  }
}
