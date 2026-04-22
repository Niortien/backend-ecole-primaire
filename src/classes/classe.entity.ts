import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AnneeScolaire } from '../annee-scolaire/annee-scolaire.entity';

export enum NiveauClasse {
  MATERNELLE = 'MATERNELLE',
  PRIMAIRE = 'PRIMAIRE',
}

export enum NomClasse {
  PS = 'PS',
  MS = 'MS',
  GS = 'GS',
  CP = 'CP',
  CE1 = 'CE1',
  CE2 = 'CE2',
  CM1 = 'CM1',
  CM2 = 'CM2',
}

@Entity('classes')
export class Classe {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: NomClasse })
  nom!: NomClasse;

  @Column({ nullable: true })
  libelle!: string; // ex: "CE2 A"

  @Column({ type: 'enum', enum: NiveauClasse })
  niveau!: NiveauClasse;

  @Column({ default: 30 })
  capacite!: number;

  @ManyToOne(() => AnneeScolaire, { eager: true, nullable: false })
  @JoinColumn({ name: 'annee_scolaire_id' })
  anneeScolaire!: AnneeScolaire;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
