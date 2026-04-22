import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum CategorieDepense {
  SALAIRE = 'SALAIRE',
  FOURNITURES = 'FOURNITURES',
  MAINTENANCE = 'MAINTENANCE',
  EAU_ELECTRICITE = 'EAU_ELECTRICITE',
  COMMUNICATION = 'COMMUNICATION',
  AUTRE = 'AUTRE',
}

@Entity('depenses')
export class Depense {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  libelle!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  montant!: number;

  @Column({ type: 'enum', enum: CategorieDepense, default: CategorieDepense.AUTRE })
  categorie!: CategorieDepense;

  @Column({ type: 'date' })
  date!: Date;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ nullable: true })
  justificatif!: string; // URL du fichier justificatif

  @ManyToOne(() => User, { eager: false, nullable: true })
  @JoinColumn({ name: 'comptable_id' })
  comptable!: User;

  @CreateDateColumn()
  createdAt!: Date;
}
