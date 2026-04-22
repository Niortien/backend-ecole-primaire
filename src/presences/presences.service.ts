import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Presence } from './presence.entity';
import { CreatePresenceDto, AppelClasseDto } from './dto/create-presence.dto';

@Injectable()
export class PresencesService {
  constructor(
    @InjectRepository(Presence)
    private readonly repo: Repository<Presence>,
  ) {}

  async enregistrerAppel(dto: AppelClasseDto, userId: number): Promise<Presence[]> {
    const presences = dto.presences.map((p) =>
      this.repo.create({
        eleve: { id: p.eleveId } as any,
        classe: { id: dto.classeId } as any,
        date: dto.date as any,
        statut: p.statut,
        motif: p.motif,
        createdBy: { id: userId } as any,
      }),
    );
    return this.repo.save(presences);
  }

  findByClasse(classeId: number, date?: string): Promise<Presence[]> {
    const query = this.repo.createQueryBuilder('p')
      .leftJoinAndSelect('p.eleve', 'eleve')
      .leftJoinAndSelect('p.classe', 'classe')
      .where('classe.id = :classeId', { classeId });
    if (date) query.andWhere('p.date = :date', { date });
    return query.orderBy('eleve.nom', 'ASC').getMany();
  }

  findByEleve(eleveId: number, mois?: string): Promise<Presence[]> {
    const query = this.repo.createQueryBuilder('p')
      .leftJoinAndSelect('p.eleve', 'eleve')
      .where('eleve.id = :eleveId', { eleveId });
    if (mois) {
      query.andWhere('TO_CHAR(p.date, \'YYYY-MM\') = :mois', { mois });
    }
    return query.orderBy('p.date', 'DESC').getMany();
  }

  async statsAbsences(classeId: number, anneeScolaireId: number) {
    return this.repo.createQueryBuilder('p')
      .select('eleve.id', 'eleveId')
      .addSelect('eleve.nom', 'nom')
      .addSelect('eleve.prenom', 'prenom')
      .addSelect('COUNT(*)', 'totalAbsences')
      .leftJoin('p.eleve', 'eleve')
      .leftJoin('p.classe', 'classe')
      .where('classe.id = :classeId', { classeId })
      .andWhere('p.statut != \'PRESENT\'')
      .groupBy('eleve.id')
      .addGroupBy('eleve.nom')
      .addGroupBy('eleve.prenom')
      .getRawMany();
  }
}
