import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Eleve } from '../eleves/eleve.entity';
import { FraisScolarite } from '../frais-scolarite/frais-scolarite.entity';
import { User } from '../users/user.entity';

export enum ModePaiement {
  ESPECES = 'ESPECES',
  MOBILE_MONEY = 'MOBILE_MONEY',
  CHEQUE = 'CHEQUE',
  VIREMENT = 'VIREMENT',
}

export enum StatutPaiement {
  VALIDE = 'VALIDE',
  ANNULE = 'ANNULE',
}

@Entity('paiements')
export class Paiement {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Eleve, { eager: true, nullable: false })
  @JoinColumn({ name: 'eleve_id' })
  eleve!: Eleve;

  @ManyToOne(() => FraisScolarite, { eager: true, nullable: false })
  @JoinColumn({ name: 'frais_scolarite_id' })
  fraisScolarite!: FraisScolarite;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  montant!: number;

  @Column({ type: 'date' })
  datePaiement!: Date;

  @Column({ type: 'enum', enum: ModePaiement, default: ModePaiement.ESPECES })
  modePaiement!: ModePaiement;

  @Column({ nullable: true, unique: true })
  referencePaiement!: string;

  @Column({ type: 'enum', enum: StatutPaiement, default: StatutPaiement.VALIDE })
  statut!: StatutPaiement;

  @ManyToOne(() => User, { eager: false, nullable: true })
  @JoinColumn({ name: 'comptable_id' })
  comptable!: User;

  @Column({ type: 'text', nullable: true })
  commentaire!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
