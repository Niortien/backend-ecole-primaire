import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bulletin } from './bulletin.entity';
import { Note, Periode } from '../notes/note.entity';

@Injectable()
export class BulletinsService {
  constructor(
    @InjectRepository(Bulletin)
    private readonly repo: Repository<Bulletin>,
    @InjectRepository(Note)
    private readonly noteRepo: Repository<Note>,
  ) {}

  async genererBulletins(classeId: number, anneeScolaireId: number, periode: Periode): Promise<Bulletin[]> {
    // Récupérer toutes les notes de la classe pour la période
    const notes = await this.noteRepo.find({
      where: {
        classe: { id: classeId },
        anneeScolaire: { id: anneeScolaireId },
        periode,
      },
      relations: ['eleve', 'matiere'],
    });

    // Grouper les notes par élève
    const notesByEleve = new Map<number, Note[]>();
    for (const note of notes) {
      const eleveId = note.eleve.id;
      if (!notesByEleve.has(eleveId)) notesByEleve.set(eleveId, []);
      notesByEleve.get(eleveId)!.push(note);
    }

    const bulletins: Bulletin[] = [];
    for (const [eleveId, elevNotes] of notesByEleve) {
      // Calcul de la moyenne pondérée
      let totalPoints = 0;
      let totalCoeff = 0;
      for (const n of elevNotes) {
        const coeff = Number(n.matiere.coefficient);
        totalPoints += Number(n.valeur) * coeff;
        totalCoeff += coeff;
      }
      const moyenne = totalCoeff > 0 ? totalPoints / totalCoeff : 0;

      // Chercher ou créer le bulletin
      let bulletin = await this.repo.findOne({
        where: {
          eleve: { id: eleveId },
          classe: { id: classeId },
          anneeScolaire: { id: anneeScolaireId },
          periode,
        },
      });

      if (!bulletin) {
        bulletin = this.repo.create({
          eleve: { id: eleveId } as any,
          classe: { id: classeId } as any,
          anneeScolaire: { id: anneeScolaireId } as any,
          periode,
        });
      }

      bulletin.moyenne = Math.round(moyenne * 100) / 100;
      bulletin.appreciation = this.getAppreciation(bulletin.moyenne);
      bulletins.push(await this.repo.save(bulletin));
    }

    // Calcul des rangs
    const sorted = [...bulletins].sort((a, b) => Number(b.moyenne) - Number(a.moyenne));
    for (let i = 0; i < sorted.length; i++) {
      sorted[i].rang = i + 1;
      await this.repo.save(sorted[i]);
    }

    return bulletins;
  }

  findByClasse(classeId: number, anneeScolaireId: number, periode: Periode): Promise<Bulletin[]> {
    return this.repo.find({
      where: { classe: { id: classeId }, anneeScolaire: { id: anneeScolaireId }, periode },
      relations: ['eleve'],
      order: { rang: 'ASC' },
    });
  }

  findByEleve(eleveId: number, anneeScolaireId: number): Promise<Bulletin[]> {
    return this.repo.find({
      where: { eleve: { id: eleveId }, anneeScolaire: { id: anneeScolaireId } },
      order: { periode: 'ASC' },
    });
  }

  async publier(id: number): Promise<Bulletin> {
    const bulletin = await this.repo.findOneOrFail({ where: { id } });
    bulletin.publie = true;
    return this.repo.save(bulletin);
  }

  private getAppreciation(moyenne: number): string {
    if (moyenne >= 16) return 'Très bien';
    if (moyenne >= 14) return 'Bien';
    if (moyenne >= 12) return 'Assez bien';
    if (moyenne >= 10) return 'Passable';
    return 'Insuffisant';
  }
}
