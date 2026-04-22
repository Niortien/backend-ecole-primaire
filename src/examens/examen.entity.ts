import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Classe } from '../classes/classe.entity';
import { Matiere } from '../matieres/matiere.entity';
import { AnneeScolaire } from '../annee-scolaire/annee-scolaire.entity';

export enum TypeExamen {
  DEVOIR = 'DEVOIR',
  COMPOSITION = 'COMPOSITION',
  CEPE = 'CEPE',
}

@Entity('examens')
export class Examen {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  libelle!: string;

  @Column({ type: 'enum', enum: TypeExamen, default: TypeExamen.COMPOSITION })
  type!: TypeExamen;

  @ManyToOne(() => Classe, { eager: true, nullable: false })
  @JoinColumn({ name: 'classe_id' })
  classe!: Classe;

  @ManyToOne(() => Matiere, { eager: true, nullable: true })
  @JoinColumn({ name: 'matiere_id' })
  matiere!: Matiere;

  @Column({ type: 'date' })
  date!: Date;

  @Column({ nullable: true })
  dureeMinutes!: number;

  @ManyToOne(() => AnneeScolaire, { eager: true, nullable: false })
  @JoinColumn({ name: 'annee_scolaire_id' })
  anneeScolaire!: AnneeScolaire;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
