import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Eleve, StatutEleve } from '../eleves/eleve.entity';
import { Paiement, StatutPaiement } from '../paiements/paiement.entity';
import { Depense } from '../depenses/depense.entity';
import { Presence, StatutPresence } from '../presences/presence.entity';
import { Classe } from '../classes/classe.entity';

@Injectable()
export class RapportsService {
  constructor(
    @InjectRepository(Eleve)
    private readonly eleveRepo: Repository<Eleve>,
    @InjectRepository(Paiement)
    private readonly paiementRepo: Repository<Paiement>,
    @InjectRepository(Depense)
    private readonly depenseRepo: Repository<Depense>,
    @InjectRepository(Presence)
    private readonly presenceRepo: Repository<Presence>,
    @InjectRepository(Classe)
    private readonly classeRepo: Repository<Classe>,
  ) {}

  async tableauDeBordDirecteur(anneeScolaireId: number) {
    const totalEleves = await this.eleveRepo.count({
      where: { statut: StatutEleve.INSCRIT, classe: { anneeScolaire: { id: anneeScolaireId } } },
    });

    const elevesFilles = await this.eleveRepo.count({
      where: { statut: StatutEleve.INSCRIT, sexe: 'F' as any, classe: { anneeScolaire: { id: anneeScolaireId } } },
    });

    const totalClasses = await this.classeRepo.count({
      where: { anneeScolaire: { id: anneeScolaireId } },
    });

    const effectifParClasse = await this.eleveRepo.createQueryBuilder('eleve')
      .select('classe.nom', 'classe')
      .addSelect('COUNT(eleve.id)', 'effectif')
      .leftJoin('eleve.classe', 'classe')
      .where('classe.anneeScolaire = :anneeScolaireId', { anneeScolaireId })
      .andWhere('eleve.statut = :statut', { statut: StatutEleve.INSCRIT })
      .groupBy('classe.nom')
      .orderBy('classe.nom', 'ASC')
      .getRawMany();

    return {
      totalEleves,
      elevesFilles,
      eleveGarcons: totalEleves - elevesFilles,
      totalClasses,
      effectifParClasse,
    };
  }

  async tableauDeBordComptable(anneeScolaireId: number) {
    const recettes = await this.paiementRepo.createQueryBuilder('p')
      .select('SUM(p.montant)', 'total')
      .leftJoin('p.fraisScolarite', 'frais')
      .where('frais.anneeScolaire = :anneeScolaireId', { anneeScolaireId })
      .andWhere('p.statut = :statut', { statut: StatutPaiement.VALIDE })
      .getRawOne();

    const depenses = await this.depenseRepo.createQueryBuilder('d')
      .select('SUM(d.montant)', 'total')
      .getRawOne();

    const impayeCount = await this.eleveRepo.createQueryBuilder('eleve')
      .leftJoin('eleve.classe', 'classe')
      .leftJoin('paiements', 'p', 'p.eleve_id = eleve.id')
      .where('classe.anneeScolaire = :anneeScolaireId', { anneeScolaireId })
      .andWhere('p.id IS NULL')
      .getCount();

    return {
      totalRecettes: Number(recettes?.total ?? 0),
      totalDepenses: Number(depenses?.total ?? 0),
      solde: Number(recettes?.total ?? 0) - Number(depenses?.total ?? 0),
      elevesImpayes: impayeCount,
    };
  }

  async absencesParMois(classeId: number, annee: number) {
    return this.presenceRepo.createQueryBuilder('p')
      .select('TO_CHAR(p.date, \'YYYY-MM\')', 'mois')
      .addSelect('COUNT(*)', 'totalAbsences')
      .leftJoin('p.classe', 'classe')
      .where('classe.id = :classeId', { classeId })
      .andWhere('p.statut != :statut', { statut: StatutPresence.PRESENT })
      .andWhere('EXTRACT(YEAR FROM p.date) = :annee', { annee })
      .groupBy('mois')
      .orderBy('mois', 'ASC')
      .getRawMany();
  }
}
