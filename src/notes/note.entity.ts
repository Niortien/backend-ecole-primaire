import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Eleve } from '../eleves/eleve.entity';
import { Matiere } from '../matieres/matiere.entity';
import { Classe } from '../classes/classe.entity';
import { AnneeScolaire } from '../annee-scolaire/annee-scolaire.entity';
import { Maitre } from '../maitres/maitre.entity';

export enum Periode {
  SEQUENCE1 = 'SEQUENCE1',
  SEQUENCE2 = 'SEQUENCE2',
  SEQUENCE3 = 'SEQUENCE3',
  SEQUENCE4 = 'SEQUENCE4',
  SEQUENCE5 = 'SEQUENCE5',
  SEQUENCE6 = 'SEQUENCE6',
}

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Eleve, { eager: true, nullable: false })
  @JoinColumn({ name: 'eleve_id' })
  eleve!: Eleve;

  @ManyToOne(() => Matiere, { eager: true, nullable: false })
  @JoinColumn({ name: 'matiere_id' })
  matiere!: Matiere;

  @ManyToOne(() => Classe, { eager: true, nullable: false })
  @JoinColumn({ name: 'classe_id' })
  classe!: Classe;

  @ManyToOne(() => AnneeScolaire, { eager: true, nullable: false })
  @JoinColumn({ name: 'annee_scolaire_id' })
  anneeScolaire!: AnneeScolaire;

  @Column({ type: 'enum', enum: Periode })
  periode!: Periode;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  valeur!: number;

  @Column({ nullable: true })
  observation!: string;

  @ManyToOne(() => Maitre, { eager: false, nullable: true })
  @JoinColumn({ name: 'maitre_id' })
  maitre!: Maitre;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
