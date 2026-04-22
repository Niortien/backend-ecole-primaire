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
import { Parent } from '../parents/parent.entity';

export enum Sexe {
  M = 'M',
  F = 'F',
}

export enum StatutEleve {
  INSCRIT = 'INSCRIT',
  TRANSFERE = 'TRANSFERE',
  ABANDONNE = 'ABANDONNE',
}

@Entity('eleves')
export class Eleve {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nom!: string;

  @Column()
  prenom!: string;

  @Column({ type: 'date' })
  dateNaissance!: Date;

  @Column({ nullable: true })
  lieuNaissance!: string;

  @Column({ type: 'enum', enum: Sexe })
  sexe!: Sexe;

  @Column({ nullable: true })
  photo!: string;

  @Column({ nullable: true })
  numeroDossier!: string;

  @Column({ type: 'enum', enum: StatutEleve, default: StatutEleve.INSCRIT })
  statut!: StatutEleve;

  @ManyToOne(() => Classe, { eager: true, nullable: true })
  @JoinColumn({ name: 'classe_id' })
  classe!: Classe;

  @ManyToOne(() => Parent, { eager: true, nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent!: Parent;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
