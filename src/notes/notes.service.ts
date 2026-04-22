import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note, Periode } from './note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly repo: Repository<Note>,
  ) {}

  async create(dto: CreateNoteDto, maitreId?: number): Promise<Note> {
    const note = this.repo.create({
      eleve: { id: dto.eleveId } as any,
      matiere: { id: dto.matiereId } as any,
      classe: { id: dto.classeId } as any,
      anneeScolaire: { id: dto.anneeScolaireId } as any,
      periode: dto.periode,
      valeur: dto.valeur,
      observation: dto.observation,
      maitre: maitreId ? ({ id: maitreId } as any) : undefined,
    });
    return this.repo.save(note);
  }

  findByClasse(classeId: number, periode: Periode, anneeScolaireId: number): Promise<Note[]> {
    return this.repo.find({
      where: {
        classe: { id: classeId },
        periode,
        anneeScolaire: { id: anneeScolaireId },
      },
      relations: ['eleve', 'matiere'],
      order: { eleve: { nom: 'ASC' } },
    });
  }

  findByEleve(eleveId: number, anneeScolaireId: number): Promise<Note[]> {
    return this.repo.find({
      where: {
        eleve: { id: eleveId },
        anneeScolaire: { id: anneeScolaireId },
      },
      relations: ['matiere', 'classe'],
      order: { periode: 'ASC', matiere: { nom: 'ASC' } },
    });
  }

  async findOne(id: number): Promise<Note> {
    const note = await this.repo.findOne({ where: { id }, relations: ['eleve', 'matiere', 'classe'] });
    if (!note) throw new NotFoundException(`Note #${id} introuvable`);
    return note;
  }

  async update(id: number, dto: UpdateNoteDto): Promise<Note> {
    const note = await this.findOne(id);
    Object.assign(note, { valeur: dto.valeur, observation: dto.observation });
    return this.repo.save(note);
  }

  async remove(id: number): Promise<void> {
    const note = await this.findOne(id);
    await this.repo.remove(note);
  }
}
